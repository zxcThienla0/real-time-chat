import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // ← Добавляем импорт
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { chatService } from '../../services/chatService';
import type { Conversation } from '../../types';

interface SidebarProps {
    conversations: Conversation[];
    selectedConversation?: Conversation;
    onSelectConversation: (conversation: Conversation) => void;
    onNewConversation: (conversation: Conversation) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    conversations,
                                                    selectedConversation,
                                                    onSelectConversation,
                                                    onNewConversation
                                                }) => {
    const { userId } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewChat, setShowNewChat] = useState(false);
    const [newChatNickname, setNewChatNickname] = useState('');
    const [loading, setLoading] = useState(false);

    const getPartner = (conversation: Conversation) => {
        if (!userId) return conversation.user1;

        return conversation.user1Id === userId ? conversation.user2 : conversation.user1;
    };

    const handleCreateChat = async () => {
        if (!newChatNickname.trim()) return;

        setLoading(true);
        try {
            const conversation = await chatService.createConversation(newChatNickname.trim());
            onNewConversation(conversation);
            setNewChatNickname('');
            setShowNewChat(false);
        } catch (error) {
            console.error('Failed to create chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const partner = getPartner(conv);
        return partner.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Диалоги</h2>
                    <Button
                        size="sm"
                        onClick={() => setShowNewChat(true)}
                    >
                        Новый чат
                    </Button>
                </div>

                <Input
                    placeholder="Поиск диалогов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {showNewChat && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <Input
                            placeholder="Введите никнейм..."
                            value={newChatNickname}
                            onChange={(e) => setNewChatNickname(e.target.value)}
                            className="mb-2"
                        />
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                onClick={handleCreateChat}
                                disabled={loading || !newChatNickname.trim()}
                            >
                                {loading ? 'Создание...' : 'Создать'}
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setShowNewChat(false);
                                    setNewChatNickname('');
                                }}
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {searchTerm ? 'Диалоги не найдены' : 'Нет диалогов'}
                    </div>
                ) : (
                    filteredConversations.map(conversation => {
                        const partner = getPartner(conversation);

                        return (
                            <div
                                key={conversation.id}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                                onClick={() => onSelectConversation(conversation)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">
                                            {partner.nickname.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {partner.nickname}
                                        </p>
                                        {conversation.lastMessage && (
                                            <p className="text-sm text-gray-500 truncate">
                                                {conversation.lastMessage}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400">
                                            {new Date(conversation.lastMessageAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
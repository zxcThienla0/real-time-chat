import React, { useState, useEffect } from 'react';
import type { Conversation, Message } from '../../types';
import { Sidebar } from '../layout/Sidebar';
import { ChatWindow } from './ChatWindow';
import { chatService } from '../../services/chatService';
import { Loader } from '../common/Loader';

export const ChatPage: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const loadConversations = async () => {
        try {
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (conversationId: string) => {
        try {
            const data = await chatService.getMessages(conversationId);
            setMessages(data.rows);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleSendMessage = async (content: string) => {
        if (!selectedConversation) return;

        try {
            const newMessage = await chatService.sendMessage(selectedConversation.id, content);
            setMessages(prev => [...prev, newMessage]);
            // Обновляем список диалогов
            await loadConversations();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleNewConversation = (conversation: Conversation) => {
        setConversations(prev => [conversation, ...prev]);
        setSelectedConversation(conversation);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <>
            <Sidebar
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
                onNewConversation={handleNewConversation}
            />

            {selectedConversation ? (
                <ChatWindow
                    conversation={selectedConversation}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-500 overflow-hidden">
                    <div className="text-center">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-medium mb-2">Выберите диалог</h3>
                        <p className="text-gray-400">Начните общение, выбрав существующий диалог или создав новый</p>
                    </div>
                </div>
            )}
        </>
    );
};
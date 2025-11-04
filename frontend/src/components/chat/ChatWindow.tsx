import React from 'react';
import type { Conversation, Message } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';

interface ChatWindowProps {
    conversation: Conversation;
    messages: Message[];
    onSendMessage: (content: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
                                                          conversation,
                                                          messages,
                                                          onSendMessage
                                                      }) => {
    const { userId } = useAuth();

    const getPartner = (conv: Conversation) => {
        if (!userId) return conv.user1;
        return conv.user1Id === userId ? conv.user2 : conv.user1;
    };

    const partner = getPartner(conversation);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <Avatar src={partner.avatar} alt={partner.nickname} />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{partner.nickname}</h2>
                        <p className="text-sm text-gray-500">В сети</p>
                    </div>
                </div>
            </div>

            <MessageList messages={messages} />

            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
};
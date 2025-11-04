import React from 'react';
import type { Message } from '../../types';
import { Avatar } from '../ui/Avatar';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const isOwnMessage = message.senderId === 1; // Заменить на ID текущего пользователя

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                {!isOwnMessage && (
                    <Avatar src={message.sender.avatar} alt={message.sender.nickname} size="sm" />
                )}
                <div
                    className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
};
import React, { useEffect, useRef, useState } from 'react';
import type { Message } from '../../types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
    messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);

    const scrollToBottom = () => {
        if (isAutoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
        setIsAutoScroll(isAtBottom);
    };

    const sortedMessages = [...messages].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    useEffect(() => {
        scrollToBottom();
    }, [sortedMessages]);

    return (
        <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            onScroll={handleScroll}
        >
            {sortedMessages.map(message => (
                <MessageItem key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
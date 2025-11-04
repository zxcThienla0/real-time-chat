export interface User {
    id: number;
    email: string;
    nickname: string;
    avatar?: string;
}

export interface Conversation {
    id: string;
    user1Id: number;
    user2Id: number;
    lastMessage?: string;
    lastMessageAt: string;
    user1: User;
    user2: User;
}

export interface Message {
    id: string;
    content: string;
    messageType: 'text' | 'image' | 'file';
    senderId: number;
    conversationId: string;
    isEdited: boolean;
    isDeleted: boolean;
    createdAt: string;
    sender: User;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}
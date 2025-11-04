import api from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/login', { email, password });
        return response.data;
    },

    async register(email: string, password: string, nickname: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/registration', {
            email,
            password,
            nickname
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/logout');
    },

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/profile');
        return response.data;
    },

    async refreshToken(): Promise<AuthResponse> {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post<AuthResponse>('/refresh', { refreshToken });
        return response.data;
    }
};
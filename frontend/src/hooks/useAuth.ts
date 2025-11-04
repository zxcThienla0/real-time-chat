import { useState, useCallback } from 'react';
import type { User, AuthResponse } from '../types';
import { authService } from '../services/authService';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [accessToken, setAccessToken] = useLocalStorage<string | null>('accessToken', null);
    const [refreshToken, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
    const [storedUser, setStoredUser] = useLocalStorage<User | null>('user', null);

    const initializeAuth = useCallback(async () => {
        if (storedUser && accessToken) {
            setUser(storedUser);

            try {
                await authService.getProfile();
            } catch (error) {
                logout();
            }
        }
    }, [storedUser, accessToken]);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response: AuthResponse = await authService.login(email, password);

            setUser(response.user);
            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            setStoredUser(response.user);

            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Ошибка при входе';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setAccessToken, setRefreshToken, setStoredUser]);

    const register = useCallback(async (email: string, password: string, nickname: string) => {
        setLoading(true);
        setError(null);

        try {
            const response: AuthResponse = await authService.register(email, password, nickname);

            setUser(response.user);
            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            setStoredUser(response.user);

            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Ошибка при регистрации';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setAccessToken, setRefreshToken, setStoredUser]);

    const logout = useCallback(async () => {
        setLoading(true);

        try {
            if (refreshToken) {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setStoredUser(null);
            setError(null);
            setLoading(false);
        }
    }, [refreshToken, setAccessToken, setRefreshToken, setStoredUser]);

    const refresh = useCallback(async () => {
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await authService.refreshToken();

            setAccessToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            setStoredUser(response.user);
            setUser(response.user);

            return response;
        } catch (error) {
            logout();
            throw error;
        }
    }, [refreshToken, logout, setAccessToken, setRefreshToken, setStoredUser]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const isAuthenticated = !!user && !!accessToken;

    return {
        user,
        loading,
        error,
        isAuthenticated,

        accessToken,
        refreshToken,

        login,
        register,
        logout,
        refresh,
        initializeAuth,
        clearError,
    };
};
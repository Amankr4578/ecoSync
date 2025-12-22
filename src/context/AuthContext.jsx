import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('ecosync_token');
            const savedUser = localStorage.getItem('ecosync_user');
            
            if (token && savedUser) {
                try {
                    // Verify token is still valid
                    const response = await authAPI.getMe();
                    setUser(response.data);
                    localStorage.setItem('ecosync_user', JSON.stringify(response.data));
                } catch (err) {
                    // Token invalid, clear storage
                    localStorage.removeItem('ecosync_token');
                    localStorage.removeItem('ecosync_user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const register = async (name, email, password) => {
        try {
            setError(null);
            const response = await authAPI.register({ name, email, password });
            const { token, ...userData } = response.data;
            
            localStorage.setItem('ecosync_token', token);
            localStorage.setItem('ecosync_user', JSON.stringify(userData));
            setUser(userData);
            
            return { success: true, user: userData };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login({ email, password });
            const { token, ...userData } = response.data;
            
            localStorage.setItem('ecosync_token', token);
            localStorage.setItem('ecosync_user', JSON.stringify(userData));
            setUser(userData);
            
            return { success: true, user: userData };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('ecosync_token');
        localStorage.removeItem('ecosync_user');
        setUser(null);
    };

    const updateProfile = async (data) => {
        try {
            setError(null);
            const response = await authAPI.updateProfile(data);
            const { token, ...userData } = response.data;
            
            if (token) {
                localStorage.setItem('ecosync_token', token);
            }
            localStorage.setItem('ecosync_user', JSON.stringify(userData));
            setUser(userData);
            
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Update failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const refreshUser = async () => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data);
            localStorage.setItem('ecosync_user', JSON.stringify(response.data));
        } catch (err) {
            console.error('Failed to refresh user:', err);
        }
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        refreshUser,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

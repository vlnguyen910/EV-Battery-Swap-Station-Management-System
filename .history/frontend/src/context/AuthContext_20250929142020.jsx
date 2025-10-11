// Auth context
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(false);

    const isAuthenticated = !!user;

    // Login function
    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            setToken(data.token);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data.user; // Return base on role to redirect          
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    // Register function
    const register = async (userInfo) => {
        setLoading(true);
        try {
            const data = await authService.register(userInfo);
            return data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Check user again if refresh the page
    useEffect(() => {
        const saveUser = localStorage.getItem('user');
        if (saveUser) {
            setUser(JSON.parse(saveUser));
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, token, setToken, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
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
    const logout = async
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
import { useContext } from "react";

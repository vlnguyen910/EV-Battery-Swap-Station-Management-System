// Auth context
import { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const { login: loginService, logout: logoutService, register: registerService } = authService;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const [error, setError] = useState(null);
    const isAuthenticated = !!user;

    // Function to handle login
    const login = async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            const response = await loginService(credentials);
            console.log('Login response:', response);

            // Backend returns { accessToken, refreshToken }
            // Extract user info from JWT payload (decode without verification for display)
            const tokenPayload = JSON.parse(atob(response.accessToken.split('.')[1]));

            const userData = {
                id: tokenPayload.sub,
                name: tokenPayload.username,
                email: tokenPayload.email,
                phone: tokenPayload.phone,
                role: tokenPayload.role
            };

            setUser(userData);
            setToken(response.accessToken);

            localStorage.setItem("token", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("user", JSON.stringify(userData));

            return userData; // Return user base on role when successful login     
        } catch (error) {
            setError(error);
            throw error; // Throw error để TestAuthPage catch được
        } finally {
            setLoading(false);
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Logout error:", error);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // Function to handle register
    const register = async (userInfo) => {
        setLoading(true);
        setError(null);

        try {
            const response = await registerService(userInfo);
            console.log('Register response:', response);

            // Handle successful registration (e.g., auto-login)
            const tokenPayload = JSON.parse(atob(response.accessToken.split('.')[1]));
            const userData = {
                id: tokenPayload.sub,
                name: tokenPayload.username,
                email: tokenPayload.email,
                phone: tokenPayload.phone,
                role: tokenPayload.role
            };

            setUser(userData);
            setToken(response.accessToken);

            localStorage.setItem("token", response.accessToken);
            localStorage.setItem("refreshToken", response.refreshToken);
            localStorage.setItem("user", JSON.stringify(userData));

            return userData;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Check user if reload page
    useEffect(() => {
        const saveUser = localStorage.getItem("user");
        if (saveUser) {
            setUser(JSON.parse(saveUser));
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, token, loading, error, isAuthenticated, login, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    )
}
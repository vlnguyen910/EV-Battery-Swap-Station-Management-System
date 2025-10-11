// Auth service
import api from "./api";
import { API_ENDPOINTS } from "../constants";

//Login function
export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

//Logout function
export const logout = async () => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

//Register function
export const register = async (userInfo) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userInfo);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

//get current user profile
export const getProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USERS.GET_PROFILE);
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

// Legacy authService object for backward compatibility
export const authService = {
  login,
  logout,
  register,
  getProfile,
};

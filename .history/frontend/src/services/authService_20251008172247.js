// Auth service
import api from "./api";
import { API_ENDPOINTS } from "../constants";

//Login function
const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

//Logout function
const logout = async () => {
  try {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true };
  } catch (error) {
    // Vẫn clear localStorage dù API lỗi
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("Logout error:", error);
    return { success: true };
  }
};

//Register function
const register = async (userInfo) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userInfo);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

//get current user profile
const getProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USERS.GET_PROFILE);
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

//Get all users
const getAllUser = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USER.GET_ALL_USERS);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

// Legacy authService object for backward compatibility
export const authService = {
  login,
  logout,
  register,
  getProfile,
  getAllUser,
};

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

//update user profile
const updateProfile = async (profileData) => {
  try {
    const response = await api.patch(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

//get current user profile
const getProfile = async (userId) => {
  try {
    const response = await api.get(API_ENDPOINTS.USER.GET_PROFILE(userId));
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    if (error.response) console.log(error.response.data, error.response.status);
    else if (error.request) console.log(error.request);
    else console.log(error.message);
    throw error;
  }
};

//Get all users
const getAllUsers = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USER.GET_ALL_USERS);
    return response.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

// Delete user by ID
const deleteUser = async (userId) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.USER.DELETE_USER}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

// Legacy authService object for backward compatibility
export const authService = {
  login,
  logout,
  register,
  getProfile,
  getAllUsers,
  updateProfile,
  deleteUser,
};

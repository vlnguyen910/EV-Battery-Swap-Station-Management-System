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

//Create account for staff
const createStaffAccount = async (staffInfo) => {
  try {
    // Basic client-side validation to match backend CreateUserDto
    const errors = [];
    if (!staffInfo.username || staffInfo.username.trim().length < 2) {
      errors.push("Username must be at least 2 characters");
    }
    if (!staffInfo.password || staffInfo.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!staffInfo.email || !/^\S+@\S+\.\S+$/.test(staffInfo.email)) {
      errors.push("A valid email is required");
    }
    if (!staffInfo.phone) {
      errors.push("Phone is required");
    }
    if (!staffInfo.role) {
      errors.push("Role is required");
    }

    if (errors.length) {
      // throw a shaped error so UI can display validation details
      const err = new Error("Validation failed");
      err.details = errors;
      throw err;
    }

    // Normalize phone similar to backend normalization.util.normalizePhone
    const normalizePhoneLocal = (phone) => {
      if (!phone) return phone;
      let normalized = phone.toString().replace(/\D/g, "");
      // If starts with country code 84, convert to 0xxxx
      if (normalized.startsWith("84")) {
        normalized = "0" + normalized.slice(2);
      }
      return normalized;
    };

    const payload = {
      username: staffInfo.username.trim(),
      password: staffInfo.password,
      phone: normalizePhoneLocal(staffInfo.phone),
      email: staffInfo.email.trim().toLowerCase(),
      role: staffInfo.role,
    };

    // use same key used by AuthContext ("token")
    const token = localStorage.getItem("token");
    const response = await api.post(API_ENDPOINTS.USER.USERS, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    // Surface server-side validation details if present
    console.error("Create staff account error (raw):", error);
    // If ValidationPipe returned details, attach the server 'message' array to error.details
    if (error?.response?.data) {
      const serverData = error.response.data;
      console.error("Create staff server response:", serverData);
      const err = new Error("Server validation error");
      // prefer the message array (typical NestJS ValidationPipe shape)
      err.details = serverData.message ?? serverData;
      err.response = serverData;
      throw err;
    }
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
    const response = await api.get(API_ENDPOINTS.USER.USERS);
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
  createStaffAccount,
};

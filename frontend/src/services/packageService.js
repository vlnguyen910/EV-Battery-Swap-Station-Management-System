import api from "./api";
import { API_ENDPOINTS } from "../constants";

const getAllPackages = async () => {
  try {
    const response = await api.get(
      API_ENDPOINTS.BATTERY_SERVICE_PACKAGE.GET_ALL_PACKAGES
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all packages:", error);
    throw error;
  }
};

const getPackageById = async (packageId) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.BATTERY_SERVICE_PACKAGE.GET_PACKAGE_BY_ID}/${packageId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching package by ID:", error);
    throw error;
  }
};

export const packageService = {
  getAllPackages,
  getPackageById,
};

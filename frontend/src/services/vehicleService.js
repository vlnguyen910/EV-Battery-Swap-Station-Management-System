import api from "./api";
import { API_ENDPOINTS } from "../constants";

// Get all vehicle function
const getAllVehicles = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.VEHICLE.GET_ALL_VEHICLES);
    return response.data;
  } catch (error) {
    console.error("Error fetching all vehicles:", error);
    throw error;
  }
};

// Get vehicle by ID function
const getVehicleById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.VEHICLE.GET_VEHICLE(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    throw error;
  }
};

// Get vehicle by VIN function
const getVehicleByVin = async (vin) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.VEHICLE.GET_VEHICLE_BY_VIN(vin)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle by VIN:", error);
    throw error;
  }
};

export const vehicleService = {
  getAllVehicles,
  getVehicleById,
  getVehicleByVin,
};

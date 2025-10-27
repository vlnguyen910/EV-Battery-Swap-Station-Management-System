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

// Get vehicle by user ID function
const getVehicleByUserId = async (userId) => {
  try {
    // Backend expects a query parameter on /vehicles: /vehicles?userId=5
    const response = await api.get(
      `${API_ENDPOINTS.VEHICLE.GET_ALL_VEHICLES}?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicles by user ID:", error);
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

// Update vehicle function
const updateVehicle = async (vehicleId, updateData) => {
  try {
    const response = await api.patch(
      API_ENDPOINTS.VEHICLE.UPDATE_VEHICLE(vehicleId),
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

//Function to create vehicle
 const createVehicle = async (vehicleData) => {
  try { 
    const response = await api.post(
      API_ENDPOINTS.VEHICLE.CREATE_VEHICLE,
      vehicleData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error;
  }
};

export const vehicleService = {
  getAllVehicles,
  getVehicleById,
  getVehicleByVin,
  getVehicleByUserId,
  updateVehicle,
};

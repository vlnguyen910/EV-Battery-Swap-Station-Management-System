import api from "./api";
import { API_ENDPOINTS } from "../constants";

// Function get all batteries
const getAllBatteries = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.BATTERY.GET_ALL_BATTERIES);
    return response.data;
  } catch (error) {
    console.error("Error fetching batteries:", error);
    throw error;
  }
};

// Function to get battery by id
const getBatteryById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.BATTERY.GET_BATTERY(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching battery by id:", error);
    throw error;
  }
};

//Function to get battery by vehicle id
// const getBatteryByVehicleId = async (vehicleId) => {
//   try {
//     const response = await api.get(
//       API_ENDPOINTS.BATTERY.GET_BATTERY_BY_VEHICLE_ID(vehicleId)
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching battery by vehicle id:", error);
//     throw error;
//   }

// Function to get batteries by station id
const getBatteriesByStationId = async (stationId) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.BATTERY.GET_BY_STATION(stationId)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching batteries by station id:", error);
    throw error;
  }
};

// Function to update battery by id
const updateBatteryById = async (id, batteryData) => {
  try {
    const response = await api.patch(
      API_ENDPOINTS.BATTERY.UPDATE_BATTERY(id),
      batteryData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating battery by id:", error);
    throw error;
  }
};

export const batteryService = {
  getAllBatteries,
  getBatteryById,
  getBatteriesByStationId,
  updateBatteryById,
};

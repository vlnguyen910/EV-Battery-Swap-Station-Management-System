import api from "./api";
import { API_ENDPOINTS } from "../constants";

// Get all stations function
const getAllStations = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.STATION.GET_ALL_STATIONS);
    return response.data;
  } catch (error) {
    console.error("Error fetching all stations:", error);
    throw error;
  }
};

const getAvailableStations = async (userId, vehicleId = null, longitude = null, latitude = null) => {
  try {
    if (!userId) {
      throw new Error('user_id is required to fetch available stations');
    }

    // Validate coordinates - they should be provided by caller
    if (longitude === null || latitude === null) {
      throw new Error('Coordinates (longitude, latitude) are required');
    }

    // Prepare request body
    const body = {
      user_id: parseInt(userId)
    };
    
    if (vehicleId) {
      body.vehicle_id = parseInt(vehicleId);
    }

    // Prepare query params
    const params = {
      longitude,
      latitude
    };
    
    console.log('Calling getAvailableStations with:', { body, params });
    
    const response = await api.post(
      API_ENDPOINTS.STATION.GET_AVAILABLE_STATIONS,
      body,
      { params }
    );
    
    console.log('getAvailableStations response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching available stations:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error details:", {
      message: error.message,
      backendMessage: error.response?.data?.message,
      backendError: error.response?.data?.error,
      validationErrors: error.response?.data?.errors,
      status: error.response?.status,
      userId,
      vehicleId
    });
    throw error;
  }
};

//Get station by ID function
const getStationById = async (id) => {
  try {
    // GET_STATION is a function that returns the path
    const response = await api.get(API_ENDPOINTS.STATION.GET_STATION(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching station by ID:", error);
    throw error;
  }
};



export const stationService = {
  getAllStations,
  getStationById,
  getAvailableStations,
};

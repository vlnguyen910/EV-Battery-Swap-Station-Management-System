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

export const stationService = {
  getAllStations,
};

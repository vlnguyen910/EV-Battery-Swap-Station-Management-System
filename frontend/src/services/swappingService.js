import api from "./api";
import { API_ENDPOINTS } from "../constants";

const swapBatteries = async (payload) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.SWAPPING.AUTOMATIC_SWAP,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error calling automatic swap:", error);
    throw error;
  }
};

const initializeBattery = async (payload) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.SWAPPING.INITIALIZE_BATTERY,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error calling initialize battery:", error);
    throw error;
  }
};

export const swappingService = {
  swapBatteries,
  initializeBattery,
};

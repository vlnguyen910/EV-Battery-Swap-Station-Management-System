import api from "./api";
import { API_ENDPOINTS } from "../constants";

// Function to create a new swap history record
const createSwapHistory = async (swapData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.SWAP_TRANSACTION.CREATE_TRANSACTION,
      swapData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating swap history:", error);
    throw error;
  }
};

// Function to get all swap history records
const getAllSwapHistories = async () => {
  try {
    const response = await api.get(
      API_ENDPOINTS.SWAP_TRANSACTION.GET_ALL_TRANSACTIONS
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching swap histories:", error);
    throw error;
  }
};

export const swapService = {
  createSwapHistory,
  getAllSwapHistories,
};

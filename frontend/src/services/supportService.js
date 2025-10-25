import api from "./api";
import { API_ENDPOINTS } from "../constants";

//Add a new support ticket
const createSupportTicket = async (ticketData) => {
  try {
    const response = await api.post(API_ENDPOINTS.SUPPORT.CREATE_SUPPORT, ticketData);
    return response.data;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
};

export const supportService = {
  createSupportTicket,
};

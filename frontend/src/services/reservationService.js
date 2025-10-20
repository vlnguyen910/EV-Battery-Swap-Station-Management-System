import api from "./api";
import { API_ENDPOINTS } from "../constants";

//Function to get all reservations
const getAllReservations = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_ALL_RESERVATIONS);
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

// Function to create a new reservation
const createReservation = async (reservationData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.CREATE_RESERVATION,
      reservationData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

// Function to get reservation by user_id
const getReservationByUserId = async (userId) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.GET_RESERVATION}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reservation by user ID:", error);
    throw error;
  }
};

//Export các hàm dịch vụ
export const reservationService = {
  getAllReservations,
  createReservation,
  getReservationByUserId,
};

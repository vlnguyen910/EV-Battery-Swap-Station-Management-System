import api from "./api";
import { API_ENDPOINTS } from "../constants";

//Function to get all reservations
const getAllReservations = async () => {
  try {
    const response = await api.get(
      API_ENDPOINTS.RESERVATION.GET_ALL_RESERVATIONS
    );
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
      API_ENDPOINTS.RESERVATION.CREATE_RESERVATION,
      reservationData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

// Function to get reservation by ID (not user_id - use proper endpoint)
const getReservationById = async (id) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.RESERVATION.GET_RESERVATION(id)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    throw error;
  }
};

//Export các hàm dịch vụ
export const reservationService = {
  getAllReservations,
  createReservation,
  getReservationById,
};

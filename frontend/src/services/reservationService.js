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

// Function to update reservation status
const updateReservationStatus = async (reservationId, userId, status) => {
  try {
    const response = await api.patch(
      API_ENDPOINTS.RESERVATION.UPDATE_RESERVATION(reservationId),
      { user_id: userId, status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating reservation status:", error);
    throw error;
  }
};

// Function to get reservations by user ID
const getReservationsByUserId = async (userId) => {
  try {
    const response = await api.get(`/reservations/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    throw error;
  }
};

// Function to get scheduled reservations (status = "scheduled")
const getScheduledReservations = async () => {
  try {
    const response = await api.get(
      API_ENDPOINTS.RESERVATION.GET_ALL_RESERVATIONS
    );
    const allReservations = response.data;
    // Filter only scheduled reservations
    return allReservations.filter((res) => res.status === "scheduled");
  } catch (error) {
    console.error("Error fetching scheduled reservations:", error);
    throw error;
  }
};

//Export các hàm dịch vụ
export const reservationService = {
  getAllReservations,
  createReservation,
  getReservationById,
  updateReservationStatus,
  getReservationsByUserId,
  getScheduledReservations,
};

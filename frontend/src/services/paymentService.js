import api from "./api";
import { API_ENDPOINTS } from "../constants";

// Function get payment by user ID
const getPaymentByUserId = async (userId) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.PAYMENT.GET_PAYMENTS_BY_USER(userId)
    );
    console.log("Fetched payments:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments by user ID:", error);
    throw error;
  }
};

const createPayment = async (paymentData) => {
  try {
    const response = await api.post(API_ENDPOINTS.PAYMENT.CREATE_VNPAY_URL, paymentData);
    console.log("Created payment:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const paymentService = {
  getPaymentByUserId,
  createPayment,
};






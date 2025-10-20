import api from './api';
import { API_ENDPOINTS } from '../constants';

//Tạo reserveration mới
const createReservation = async (reservationData) => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_RESERVATION, reservationData);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};
//Export các hàm dịch vụ
export const reservationService = {
  createReservation,
  
};

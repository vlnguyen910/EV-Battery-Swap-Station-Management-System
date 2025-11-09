import api from './api';
import { API_ENDPOINTS } from '../constants';

const getAllRequests = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.BATTERY_TRANSFER_REQUEST.GET_ALL_REQUESTS);
    return response.data;
  } catch (error) {
    console.error('Error fetching transfer requests:', error);
    throw error;
  }
};

const getRequestById = async (requestId) => {
  try {
    const response = await api.get(API_ENDPOINTS.BATTERY_TRANSFER_REQUEST.GET_REQUEST(requestId));
    return response.data;
  } catch (error) {
    console.error('Error fetching transfer request:', error);
    throw error;
  }
};

const createRequest = async (requestData) => {
  try {
    const response = await api.post(API_ENDPOINTS.BATTERY_TRANSFER_REQUEST.CREATE_REQUEST, requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating transfer request:', error);
    throw error;
  }
};

const updateRequest = async (requestId, updateData) => {
  try {
    const response = await api.patch(
      API_ENDPOINTS.BATTERY_TRANSFER_REQUEST.UPDATE_REQUEST(requestId),
      updateData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating transfer request:', error);
    throw error;
  }
};

const deleteRequest = async (requestId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.BATTERY_TRANSFER_REQUEST.DELETE_REQUEST(requestId));
    return response.data;
  } catch (error) {
    console.error('Error deleting transfer request:', error);
    throw error;
  }
};

export const batteryTransferService = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
};

export default batteryTransferService;

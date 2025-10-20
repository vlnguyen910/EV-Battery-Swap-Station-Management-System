import api from './api';
import { API_ENDPOINTS } from '../constants';

// Function lấy all batteries

const getAllBatteries = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.BATTERY.GET_ALL_BATTERIES);
        return response.data;
    } catch (error) {
        console.error('Error fetching batteries:', error);
        throw error;
    }
};

export const batteryService = {
    getAllBatteries,
};


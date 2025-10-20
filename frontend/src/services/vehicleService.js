import api from './api';
import { API_ENDPOINTS } from '../constants';

//Function liên quan vehicle 
//Lấy tất cả vehicle 
const getAllVehicles = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.VEHICLE.GET_ALL_VEHICLES);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Function lấy vehicle 
const getVehicleById = async (id) => {
    try {
        const response = await api.get(API_ENDPOINTS.VEHICLE.GET_VEHICLE(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Function lấy vehicle by VIN
const getVehicleByVin = async (vin) => {
    try {
        const response = await api.get(API_ENDPOINTS.VEHICLE.GET_VEHICLE_BY_VIN(vin));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const vehicleService = {
    getAllVehicles,
    getVehicleById,
};

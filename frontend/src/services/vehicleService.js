import api from "./api";
import { API_ENDPOINTS } from "../constants";
import { batteryService } from "./batteryService";
import { parseBatteryNumber } from "../utils/battery";

// Get all vehicle function
const getAllVehicles = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.VEHICLE.GET_ALL_VEHICLES);
    return response.data;
  } catch (error) {
    console.error("Error fetching all vehicles:", error);
    throw error;
  }
};

// Get vehicle by user ID function
const getVehicleByUserId = async (userId) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.VEHICLE.GET_VEHICLES_BY_USER(userId)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicles by user ID:", error);
    throw error;
  }
};

// Get vehicle by ID function
const getVehicleById = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.VEHICLE.GET_VEHICLE(id));
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    throw error;
  }
};

// Get vehicle by VIN function
const getVehicleByVin = async (vin) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.VEHICLE.GET_VEHICLE_BY_VIN(vin)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle by VIN:", error);
    throw error;
  }
};

// Update vehicle function
const updateVehicle = async (vehicleId, updateData) => {
  try {
    const response = await api.patch(
      API_ENDPOINTS.VEHICLE.UPDATE_VEHICLE(vehicleId),
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

//Function to create vehicle
const createVehicle = async (vehicleData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.VEHICLE.CREATE_VEHICLE,
      vehicleData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating vehicle:", error);
    throw error;
  }
};

export const vehicleService = {
  getAllVehicles,
  getVehicleById,
  getVehicleByVin,
  getVehicleByUserId,
  updateVehicle,
  createVehicle,
};

// parseBatteryNumber moved to ../utils/battery for reuse

// Fetch vehicles by user and enrich each vehicle with batteryLevel, soh and estimatedRange.
const getVehiclesByUserIdWithBattery = async (userId) => {
  try {
    const vehicles = await getVehicleByUserId(userId);

    const vehiclesWithBattery = await Promise.all(
      (vehicles || []).map(async (vehicle) => {
        try {
          let batteryData = vehicle?.battery ?? null;
          if (!batteryData && vehicle?.battery_id) {
            // batteryService.getBatteryById returns response.data in many cases
            const resp = await batteryService.getBatteryById(
              vehicle.battery_id
            );
            batteryData = resp?.data ?? resp?.battery ?? resp ?? null;
          }

          const rawLevel =
            batteryData?.current_charge ??
            batteryData?.pin_hien_tai ??
            batteryData?.charge_percent ??
            batteryData?.percentage ??
            batteryData?.level ??
            null;
          const parsedLevel = parseBatteryNumber(rawLevel) ?? 0;
          const soh =
            parseBatteryNumber(
              batteryData?.soh ?? batteryData?.state_of_health ?? null
            ) ?? 0;
          const estimatedRange = parsedLevel
            ? Math.floor(parsedLevel * 4.2) + " km"
            : "N/A";

          return {
            ...vehicle,
            batteryLevel: parsedLevel,
            soh,
            estimatedRange,
          };
        } catch (err) {
          console.warn("Failed to enrich vehicle with battery:", err);
          return { ...vehicle, batteryLevel: 0, soh: 0, estimatedRange: "N/A" };
        }
      })
    );

    return vehiclesWithBattery;
  } catch (error) {
    console.error("Error fetching/enriching vehicles by user ID:", error);
    throw error;
  }
};

// expose enriched fetch on the exported service
vehicleService.getVehiclesByUserIdWithBattery = getVehiclesByUserIdWithBattery;

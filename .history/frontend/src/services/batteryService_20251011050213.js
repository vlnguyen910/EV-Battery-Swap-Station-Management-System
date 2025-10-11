import {
  generateMockBatteries,
  calculateCurrentCharge,
  getChargePercentage,
  getBatteryStatusInfo,
} from "../data/mockBatteryData";

// Mock API calls - replace with real API later
const batteryService = {
  // Get all batteries
  getAllBatteries: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const batteries = generateMockBatteries();
    return {
      success: true,
      data: batteries.map((battery) => ({
        ...battery,
        pin_hien_tai: calculateCurrentCharge(battery),
        statusInfo: getBatteryStatusInfo(battery),
      })),
    };
  },

  // Get battery by ID
  getBatteryById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const batteries = generateMockBatteries();
    const battery = batteries.find((b) => b.battery_id === parseInt(id));

    if (!battery) {
      throw new Error(`Battery with ID ${id} not found`);
    }

    return {
      success: true,
      data: {
        ...battery,
        pin_hien_tai: calculateCurrentCharge(battery),
        statusInfo: getBatteryStatusInfo(battery),
      },
    };
  },

  // Get batteries by station
  getBatteriesByStation: async (stationId) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const batteries = generateMockBatteries();
    const stationBatteries = batteries.filter(
      (b) => b.station_id === parseInt(stationId)
    );

    return {
      success: true,
      data: stationBatteries.map((battery) => ({
        ...battery,
        pin_hien_tai: calculateCurrentCharge(battery),
        statusInfo: getBatteryStatusInfo(battery),
      })),
    };
  },
};

export default batteryService;

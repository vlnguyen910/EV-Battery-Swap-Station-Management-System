// Mock battery data with real-time charging simulation

export const generateMockBatteries = () => {
  const baseData = [
    {
      battery_id: 1,
      vehicle_id: 101,
      station_id: 1,
      model: "Model Y",
      capacity: 75000, // 75kWh
      status: "charging",
      soh: 95.5,
      last_maintenance: "2024-01-15T10:30:00Z",
      slot_number: 1,
    },
    {
      battery_id: 2,
      vehicle_id: 102,
      station_id: 1,
      model: "Model 3",
      capacity: 60000, // 60kWh
      status: "full",
      soh: 88.2,
      last_maintenance: "2024-01-10T14:20:00Z",
      slot_number: 2,
    },
    {
      battery_id: 3,
      vehicle_id: null,
      station_id: 1,
      model: "Model S",
      capacity: 100000, // 100kWh
      status: "charging",
      soh: 76.8,
      last_maintenance: "2024-01-05T09:15:00Z",
      slot_number: 9,
    },
    {
      battery_id: 4,
      vehicle_id: null,
      station_id: 1,
      model: "Model X",
      capacity: 95000, // 95kWh
      status: "defective",
      soh: 45.2,
      last_maintenance: "2023-12-20T16:45:00Z",
      slot_number: 5,
    },
  ];

  return baseData.map((battery) => ({
    ...battery,
    pin_hien_tai: calculateCurrentCharge(battery),
    charging_start_time:
      battery.status === "charging" ? Date.now() - Math.random() * 60000 : null,
  }));
};

// Fake charging simulation - 0% to 100% in 2 minutes (120 seconds)
export const calculateCurrentCharge = (battery) => {
  if (battery.status !== "charging") {
    // Static values for non-charging batteries
    switch (battery.status) {
      case "full":
        return battery.capacity;
      case "taken":
        return battery.capacity * 0.8; // 80%
      case "booked":
        return battery.capacity * 0.6; // 60%
      case "defective":
        return battery.capacity * 0.1; // 10%
      default:
        return battery.capacity * 0.5; // 50%
    }
  }

  // For charging batteries - simulate 0-100% in 2 minutes
  const chargingDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
  const startTime = battery.charging_start_time || Date.now();
  const elapsed = Date.now() - startTime;

  // Calculate percentage (0-100%)
  const chargePercent = Math.min((elapsed / chargingDuration) * 100, 100);

  // Convert to actual charge (10-100% of capacity)
  const minCharge = battery.capacity * 0.1; // Start from 10%
  const maxCharge = battery.capacity; // Full capacity

  return minCharge + (chargePercent / 100) * (maxCharge - minCharge);
};

// Get charge percentage for display
export const getChargePercentage = (battery) => {
  return Math.round((battery.pin_hien_tai / battery.capacity) * 100);
};

// Get battery status info for UI
export const getBatteryStatusInfo = (battery) => {
  const percentage = getChargePercentage(battery);

  const statusConfig = {
    charging: { color: "yellow", label: "Charging" },
    full: { color: "green", label: "Full" },
    taken: { color: "blue", label: "In Use" },
    booked: { color: "orange", label: "Booked" },
    defective: { color: "red", label: "Maintenance" },
  };

  return {
    ...statusConfig[battery.status],
    percentage,
    needsAttention: percentage < 20 || battery.soh < 80,
    alerts: getAlerts(battery, percentage),
  };
};

// Generate alerts based on battery condition
const getAlerts = (battery, percentage) => {
  const alerts = [];

  if (percentage < 20) {
    alerts.push({
      type: "warning",
      message: "Needs immediate charging",
      icon: "warning",
    });
  }

  if (battery.soh < 80) {
    alerts.push({
      type: "error",
      message: "Requires maintenance",
      icon: "maintenance",
    });
  }

  if (battery.status === "defective") {
    alerts.push({
      type: "error",
      message: "Out of service",
      icon: "error",
    });
  }

  return alerts;
};

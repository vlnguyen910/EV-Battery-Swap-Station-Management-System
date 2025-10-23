import { useState, useMemo } from "react";

/**
 * Calculate charge percentage from battery's current_charge and capacity
 * Uses real database value from current_charge field
 * @param {Object} battery - Battery object from database
 * @returns {number} Percentage (0-100)
 */
export const getChargePercentage = (battery) => {
  if (!battery || !battery.capacity || battery.capacity === 0) {
    return 0;
  }

  // Use current_charge from database (not pin_hien_tai)
  const currentCharge = battery.current_charge || 0;

  const percentage = Math.round((currentCharge / battery.capacity) * 100);
  // Ensure percentage is within 0-100 range
  return Math.max(0, Math.min(100, percentage));
};

/**
 * Get battery status information for UI rendering
 * Maps database status enum to display properties
 * @param {Object} battery - Battery object from database
 * @returns {Object} Status info with color, label, percentage, alerts, etc.
 */
export const getBatteryStatusInfo = (battery) => {
  const percentage = getChargePercentage(battery);

  // Map database status enum to UI display config
  // Database enum: 'full', 'charging', 'booked', 'in_use', 'defective'
  const statusConfig = {
    full: { color: "green", label: "Available" },
    charging: { color: "yellow", label: "Charging" },
    booked: { color: "orange", label: "Booked" },
    in_use: { color: "blue", label: "In Use" },
    defective: { color: "red", label: "Maintenance" },
  };

  const config = statusConfig[battery.status] || {
    color: "gray",
    label: "Unknown",
  };

  return {
    ...config,
    percentage,
    needsAttention: percentage < 20 || battery.soh < 80,
    alerts: getAlerts(battery, percentage),
  };
};

/**
 * Generate alert messages based on battery condition
 * @param {Object} battery - Battery object from database
 * @param {number} percentage - Current charge percentage
 * @returns {Array} Array of alert objects
 */
const getAlerts = (battery, percentage) => {
  const alerts = [];

  // Low charge warning
  if (percentage < 20) {
    alerts.push({
      type: "warning",
      message: "Needs immediate charging",
      icon: "warning",
    });
  }

  // Low State of Health warning
  if (battery.soh < 80) {
    alerts.push({
      type: "error",
      message: "Requires maintenance",
      icon: "maintenance",
    });
  }

  // Defective status alert
  if (battery.status === "defective") {
    alerts.push({
      type: "error",
      message: "Out of service",
      icon: "error",
    });
  }

  return alerts;
};

/**
 * Custom hook for filtering batteries based on multiple criteria
 * @param {Array} batteries - Array of battery objects from API/context
 * @returns {Object} filters, setFilters, and filteredBatteries
 */
export const useBatteryFilter = (batteries) => {
  const [filters, setFilters] = useState({
    model: "all",
    soc: "all",
    soh: "all",
  });

  const filteredBatteries = useMemo(() => {
    if (!Array.isArray(batteries)) {
      return [];
    }

    return batteries.filter((battery) => {
      if (!battery) return false;

      // Filter by model
      if (filters.model !== "all" && battery.model !== filters.model) {
        return false;
      }

      // Filter by State of Charge (SOC)
      const percentage = getChargePercentage(battery);
      if (filters.soc === "low" && percentage >= 20) {
        return false;
      }
      if (filters.soc === "high" && percentage < 80) {
        return false;
      }

      // Filter by State of Health (SOH)
      if (filters.soh === "maintenance" && battery.soh >= 80) {
        return false;
      }

      return true;
    });
  }, [batteries, filters]);

  return {
    filters,
    setFilters,
    filteredBatteries,
  };
};

import { useState, useMemo } from "react";
import { getChargePercentage } from "../data/mockBatteryData";

export const useBatteryFilter = (batteries) => {
  const [filters, setFilters] = useState({
    model: "all",
    soc: "all",
    soh: "all",
  });

  const filteredBatteries = useMemo(() => {
    return batteries.filter((battery) => {
      // Filter by model
      if (filters.model !== "all" && battery.model !== filters.model) {
        return false;
      }

      // Filter by State of Charge
      const percentage = getChargePercentage(battery);
      if (filters.soc === "low" && percentage >= 20) {
        return false;
      }
      if (filters.soc === "high" && percentage < 80) {
        return false;
      }

      // Filter by State of Health
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

// Mock battery data with real-time charging simulation

export const generateMockBatteries = () => {
  const baseData = [
    {
      battery_id: 1,
      vehicle_id: 101,
      station_id: 1,
      model: "Model Y",
      capacity: 75000,
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
      capacity: 60000,
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
      capacity: 100000,
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
      capacity: 95000,
      status: "defective",
      soh: 45.2,
      last_maintenance: "2023-12-20T16:45:00Z",
      slot_number: 5,
    },
    {
      battery_id: 5,
      vehicle_id: null,
      station_id: 1,
      model: "Model Y",
      capacity: 75000,
      status: "charging",
      soh: 92.5,
      soc: 35,
      last_maintenance: "2024-08-15T10:00:00Z",
      slot_number: 6,
    },
    {
      battery_id: 6,
      vehicle_id: null,
      station_id: 1,
      model: "Model X",
      capacity: 95000,
      status: "full",
      soh: 81.0,
      soc: 100,
      last_maintenance: "2024-05-20T14:30:00Z",
      slot_number: 7,
    },
    {
      battery_id: 7,
      vehicle_id: 101,
      station_id: null,
      model: "Model Y",
      capacity: 75000,
      status: "taken",
      soh: 98.7,
      soc: 75,
      last_maintenance: "2024-09-01T08:00:00Z",
      slot_number: null,
    },
    {
      battery_id: 8,
      vehicle_id: null,
      station_id: 1,
      model: "Model X",
      capacity: 95000,
      status: "charging",
      soh: 88.9,
      soc: 15,
      last_maintenance: "2024-07-10T11:20:00Z",
      slot_number: 9,
    },
    {
      battery_id: 9,
      vehicle_id: null,
      station_id: 1,
      model: "Model Y",
      capacity: 75000,
      status: "defective",
      soh: 68.3,
      soc: 50,
      last_maintenance: "2023-10-01T17:00:00Z",
      slot_number: 10,
    },
    {
      battery_id: 10,
      vehicle_id: null,
      station_id: 1,
      model: "Model X",
      capacity: 95000,
      status: "booked",
      soh: 95.1,
      soc: 90,
      last_maintenance: "2024-09-25T09:15:00Z",
      slot_number: 11,
    },
    {
      battery_id: 11,
      vehicle_id: null,
      station_id: 1,
      model: "Model Y",
      capacity: 75000,
      status: "available",
      soh: 99.9,
      soc: 85,
      last_maintenance: "2024-10-10T12:00:00Z",
      slot_number: 12,
    },
  ];

  return baseData.map((battery) => ({
    ...battery,
    pin_hien_tai: calculateCurrentCharge(battery),
    charging_start_time:
      battery.status === "charging" ? Date.now() - Math.random() * 60000 : null,
  }));
};

export const calculateCurrentCharge = (battery) => {
  if (battery.status !== "charging") {
    switch (battery.status) {
      case "full":
        return battery.capacity;
      case "taken":
        return battery.capacity * 0.8;
      case "booked":
        return battery.capacity * 0.6;
      case "defective":
        return battery.capacity * 0.1;
      default:
        return battery.capacity * 0.5;
    }
  }

  const chargingDuration = 2 * 60 * 1000;
  const startTime = battery.charging_start_time || Date.now();
  const elapsed = Date.now() - startTime;
  const chargePercent = Math.min((elapsed / chargingDuration) * 100, 100);
  const minCharge = battery.capacity * 0.1;
  const maxCharge = battery.capacity;

  return minCharge + (chargePercent / 100) * (maxCharge - minCharge);
};

export const getChargePercentage = (battery) => {
  return Math.round((battery.pin_hien_tai / battery.capacity) * 100);
};

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

// export const generateMockBatteries = () => {
//   const baseData = [
//     {
//       battery_id: 1,
//       vehicle_id: 101,
//       station_id: 1,
//       model: "Model Y",
//       capacity: 75000, // 75kWh
//       status: "charging",
//       soh: 95.5,
//       last_maintenance: "2024-01-15T10:30:00Z",
//       slot_number: 1,
//     },
//     {
//       battery_id: 2,
//       vehicle_id: 102,
//       station_id: 1,
//       model: "Model 3",
//       capacity: 60000, // 60kWh
//       status: "full",
//       soh: 88.2,
//       last_maintenance: "2024-01-10T14:20:00Z",
//       slot_number: 2,
//     },
//     {
//       battery_id: 3,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model S",
//       capacity: 100000, // 100kWh
//       status: "charging",
//       soh: 76.8,
//       last_maintenance: "2024-01-05T09:15:00Z",
//       slot_number: 9,
//     },
//     {
//       battery_id: 4,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model X",
//       capacity: 95000, // 95kWh
//       status: "defective",
//       soh: 45.2,
//       last_maintenance: "2023-12-20T16:45:00Z",
//       slot_number: 5,
//     },
//     // Pin số 5: Trạng thái Đang Sạc (SOH tốt, SOC thấp)
//     {
//       battery_id: 5,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model Y",
//       capacity: 75000, // 75kWh
//       status: "charging",
//       soh: 92.5,
//       soc: 35, // Giả định SOC được thêm vào data model của bạn
//       last_maintenance: "2024-08-15T10:00:00Z",
//       slot_number: 6,
//     },
//     // Pin số 6: Trạng thái Đầy (SOH trung bình)
//     {
//       battery_id: 6,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model X",
//       capacity: 95000,
//       status: "full",
//       soh: 81.0,
//       soc: 100,
//       last_maintenance: "2024-05-20T14:30:00Z",
//       slot_number: 7,
//     },
//     // Pin số 7: Trạng thái Đã Lấy (Đang sử dụng)
//     {
//       battery_id: 7,
//       vehicle_id: 101,
//       station_id: null, // Đang được sử dụng, không ở trạm sạc
//       model: "Model Y",
//       capacity: 75000,
//       status: "taken",
//       soh: 98.7,
//       soc: 75,
//       last_maintenance: "2024-09-01T08:00:00Z",
//       slot_number: null,
//     },
//     // Pin số 8: Trạng thái Đang Sạc (SOC rất thấp, cần cảnh báo)
//     {
//       battery_id: 8,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model X",
//       capacity: 95000,
//       status: "charging",
//       soh: 88.9,
//       soc: 15,
//       last_maintenance: "2024-07-10T11:20:00Z",
//       slot_number: 9,
//     },
//     // Pin số 9: Trạng thái Bảo trì/Defective (SOH thấp)
//     {
//       battery_id: 9,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model Y",
//       capacity: 75000,
//       status: "defective",
//       soh: 68.3,
//       soc: 50,
//       last_maintenance: "2023-10-01T17:00:00Z",
//       slot_number: 10,
//     },
//     // Pin số 10: Trạng thái Đã Đặt (Available)
//     {
//       battery_id: 10,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model X",
//       capacity: 95000,
//       status: "booked",
//       soh: 95.1,
//       soc: 90,
//       last_maintenance: "2024-09-25T09:15:00Z",
//       slot_number: 11,
//     },
//     // Pin số 11: Trạng thái Available (SOH rất mới)
//     {
//       battery_id: 11,
//       vehicle_id: null,
//       station_id: 1,
//       model: "Model Y",
//       capacity: 75000,
//       status: "available",
//       soh: 99.9,
//       soc: 85,
//       last_maintenance: "2024-10-10T12:00:00Z",
//       slot_number: 12,
//     },
//   ];

//   return baseData.map((battery) => ({
//     ...battery,
//     pin_hien_tai: calculateCurrentCharge(battery),
//     charging_start_time:
//       battery.status === "charging" ? Date.now() - Math.random() * 60000 : null,
//   }));
// };

// // Fake charging simulation - 0% to 100% in 2 minutes (120 seconds)
// export const calculateCurrentCharge = (battery) => {
//   if (battery.status !== "charging") {
//     // Static values for non-charging batteries
//     switch (battery.status) {
//       case "full":
//         return battery.capacity;
//       case "taken":
//         return battery.capacity * 0.8; // 80%
//       case "booked":
//         return battery.capacity * 0.6; // 60%
//       case "defective":
//         return battery.capacity * 0.1; // 10%
//       default:
//         return battery.capacity * 0.5; // 50%
//     }
//   }

//   // For charging batteries - simulate 0-100% in 2 minutes
//   const chargingDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
//   const startTime = battery.charging_start_time || Date.now();
//   const elapsed = Date.now() - startTime;

//   // Calculate percentage (0-100%)
//   const chargePercent = Math.min((elapsed / chargingDuration) * 100, 100);

//   // Convert to actual charge (10-100% of capacity)
//   const minCharge = battery.capacity * 0.1; // Start from 10%
//   const maxCharge = battery.capacity; // Full capacity

//   return minCharge + (chargePercent / 100) * (maxCharge - minCharge);
// };

// // Get charge percentage for display
// export const getChargePercentage = (battery) => {
//   return Math.round((battery.pin_hien_tai / battery.capacity) * 100);
// };

// // Get battery status info for UI
// export const getBatteryStatusInfo = (battery) => {
//   const percentage = getChargePercentage(battery);

//   const statusConfig = {
//     charging: { color: "yellow", label: "Charging" },
//     full: { color: "green", label: "Full" },
//     taken: { color: "blue", label: "In Use" },
//     booked: { color: "orange", label: "Booked" },
//     defective: { color: "red", label: "Maintenance" },
//   };

//   return {
//     ...statusConfig[battery.status],
//     percentage,
//     needsAttention: percentage < 20 || battery.soh < 80,
//     alerts: getAlerts(battery, percentage),
//   };
// };

// // mockBatteryData.js (Thêm vào cuối file)

// // ... (Các hàm và dữ liệu hiện có ở trên)

// // Lấy danh sách Model duy nhất
// export const getUniqueModels = (batteries) => {
//   // Lấy tất cả các model, loại bỏ null/undefined và chỉ giữ lại các giá trị duy nhất
//   const models = batteries
//     .map((b) => b.model)
//     .filter((value, index, self) => value && self.indexOf(value) === index)
//     .sort(); // Sắp xếp theo thứ tự alphabet
//   return ["All Models", ...models];
// };

// // Lấy danh sách Status duy nhất (có thể thêm label cho dễ đọc)
// export const getUniqueStatuses = () => {
//   // Trả về danh sách status cố định nếu bạn không muốn lấy từ dữ liệu
//   // hoặc lấy từ logic getBatteryStatusInfo để đảm bảo consistency
//   return [
//     { value: "all", label: "All Statuses" },
//     { value: "available", label: "Available" },
//     { value: "charging", label: "Charging" },
//     { value: "full", label: "Full" },
//     { value: "taken", label: "In Use" },
//     { value: "booked", label: "Booked" },
//     { value: "defective", label: "Maintenance" },
//   ];
// };

// // Logic lọc (dùng trong BatteryContext)
// export const filterBatteries = (batteries, filters) => {
//   return batteries.filter((battery) => {
//     // Lọc theo Model
//     if (filters.model !== "all" && battery.model !== filters.model) {
//       return false;
//     }

//     // Lọc theo State of Charge (SOC)
//     const percentage = getChargePercentage(battery);
//     if (filters.soc === "low" && percentage >= 20) {
//       return false;
//     }
//     if (filters.soc === "high" && percentage < 80) {
//       return false;
//     }

//     // Lọc theo State of Health (SOH)
//     if (filters.soh === "maintenance" && battery.soh >= 80) {
//       return false;
//     }

//     // Lọc theo Status (có thể thêm vào Filter.jsx nếu cần)
//     if (filters.status !== "all" && battery.status !== filters.status) {
//       return false;
//     }

//     return true;
//   });
// };

// // Generate alerts based on battery condition
// const getAlerts = (battery, percentage) => {
//   const alerts = [];

//   if (percentage < 20) {
//     alerts.push({
//       type: "warning",
//       message: "Needs immediate charging",
//       icon: "warning",
//     });
//   }

//   if (battery.soh < 80) {
//     alerts.push({
//       type: "error",
//       message: "Requires maintenance",
//       icon: "maintenance",
//     });
//   }

//   if (battery.status === "defective") {
//     alerts.push({
//       type: "error",
//       message: "Out of service",
//       icon: "error",
//     });
//   }

//   return alerts;
// };

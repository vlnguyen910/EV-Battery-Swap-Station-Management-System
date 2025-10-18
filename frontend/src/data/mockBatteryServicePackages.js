const mockBatteryServicePackages = [
  {
    package_id: 1,
    name: "Basic Plan",
    base_distance: 500,
    base_price: 300000, // VND
    phi_phat: 50000,
    duration_days: 30,
    description: "Gói cơ bản: 500km, tối đa 10 lần đổi pin/tháng.",
    active: true,
  },
  {
    package_id: 2,
    name: "Premium Plan",
    base_distance: 1200,
    base_price: 700000,
    phi_phat: 150000,
    duration_days: 30,
    description:
      "Gói cao cấp: 1200km, đổi pin không giới hạn, ưu tiên phục vụ.",
    active: true,
  },
];
export default mockBatteryServicePackages;

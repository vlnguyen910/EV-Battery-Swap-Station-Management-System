const mockUserData = [
  // Admin hệ thống
  {
    user_id: 1,
    username: "admin01",
    password_hash: "hashed_admin01_pwd",
    phone: "0909000001",
    email: "admin01@evswap.vn",
    role: "admin",
    created_at: "2024-01-01T09:00:00Z",
  },

  // Nhân viên trạm 1
  {
    user_id: 201,
    username: "manager_station1",
    password_hash: "hashed_mgr1_pwd",
    phone: "0909001201",
    email: "manager1@evswap.vn",
    role: "station_staff",
    created_at: "2024-01-05T09:00:00Z",
  },
  {
    user_id: 202,
    username: "staff_station1a",
    password_hash: "hashed_staff1a_pwd",
    phone: "0909001202",
    email: "staff1a@evswap.vn",
    role: "station_staff",
    created_at: "2024-01-06T08:30:00Z",
  },
  {
    user_id: 203,
    username: "staff_station1b",
    password_hash: "hashed_staff1b_pwd",
    phone: "0909001203",
    email: "staff1b@evswap.vn",
    role: "station_staff",
    created_at: "2024-02-10T07:15:00Z",
  },

  // Tài xế (driver)
  {
    user_id: 101,
    username: "driver_huy",
    password_hash: "hashed_driver_huy_pwd",
    phone: "0909333101",
    email: "driver_huy@evswap.vn",
    role: "driver",
    created_at: "2024-03-01T10:00:00Z",
  },
  {
    user_id: 102,
    username: "driver_linh",
    password_hash: "hashed_driver_linh_pwd",
    phone: "0909333102",
    email: "driver_linh@evswap.vn",
    role: "driver",
    created_at: "2024-03-02T11:00:00Z",
  },
  {
    user_id: 147,
    username: "hman",
    password_hash: "hman123",
    phone: "0334992929",
    email: "hman@gmail.com",
    role: "driver",
    created_at: "2024-03-02T11:00:00Z",
  },
];

export default mockUserData;

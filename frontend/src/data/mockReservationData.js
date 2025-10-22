import mockUserData from "./mockUserData";

const mockReservationData = [
  {
    reservation_id: 1,
    user_id: 101,
    battery_id: 3,
    station_id: 1,
    scheduled_time: "2024-10-20T09:00:00Z",
    status: "scheduled",
  },
  {
    reservation_id: 2,
    user_id: 102,
    battery_id: 4,
    station_id: 1,
    scheduled_time: "2024-10-21T10:30:00Z",
    status: "cancelled",
  },
];

// fix: tìm bằng user.user_id (không phải user.id)
const getUserName = (userId) => {
  const user = mockUserData.find((u) => u.user_id === userId);
  return user ? user.username : "Unknown User";
};

// Tạo bản copy enriched, không mutate original array (an toàn hơn)
const enrichedReservations = mockReservationData.map((r) => ({
  ...r,
  user_name: getUserName(r.user_id),
}));

export default enrichedReservations;

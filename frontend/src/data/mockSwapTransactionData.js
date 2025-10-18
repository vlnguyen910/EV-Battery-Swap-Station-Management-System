const mockSwapTransactionData = [
  {
    transaction_id: 1,
    user_id: 101,
    vehicle_id: 101,
    station_id: 1,
    battery_taken_id: 2, // lấy pin đầy
    battery_returned_id: 1, // trả pin cũ
    subscription_id: 1,
    createAT: "2024-09-05T10:00:00Z",
    updateAt: "2024-09-05T10:15:00Z",
    status: "completed",
  },
  {
    transaction_id: 2,
    user_id: 102,
    vehicle_id: 102,
    station_id: 1,
    battery_taken_id: 3,
    battery_returned_id: 4,
    subscription_id: 2,
    createAT: "2024-10-02T11:00:00Z",
    updateAt: "2024-10-02T11:20:00Z",
    status: "completed",
  },
];
export default mockSwapTransactionData;

import React from "react";
import reservations from "../../data/mockReservationData";

const statusClassMap = {
  scheduled: { text: "text-yellow-700", bg: "bg-yellow-100" },
  cancelled: { text: "text-red-700", bg: "bg-red-100" },
  completed: { text: "text-green-700", bg: "bg-green-100" },
};

export default function SwapHistory({ type = "swap" }) {
  const RecentTransactions = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Giao dịch Đổi Pin Gần đây
      </h3>

      {reservations.map((reservation) => {
        const cls = statusClassMap[reservation.status] || {
          text: "text-gray-700",
          bg: "bg-gray-100",
        };

        return (
          <div
            key={reservation.reservation_id}
            className="flex justify-between items-center py-2 border-b last:border-b-0"
          >
            <div>
              <p className="font-semibold">
                Giao dịch số {reservation.reservation_id} - {reservation.user_name}
              </p>
              <p className="text-sm text-gray-500">
                Pin #{reservation.battery_id} | Trạm {reservation.station_id}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-medium ${cls.text} ${cls.bg} px-3 py-1 rounded-full`}
              >
                {reservation.status}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(reservation.scheduled_time).toLocaleTimeString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (type === "swap") return <RecentTransactions />;
  return null;
}

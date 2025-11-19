// BatteryList component
export default function BatteryList({ type = "inventory" }) {
  const InventoryStatus = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Tình trạng Tồn kho chi tiết</h3>

      {[
        { model: "Model X", type: "Dung lượng cao", total: 12, full: 8, maintenance: 1, color: "green" },
        { model: "Model Y", type: "Dung lượng thường", total: 16, full: 10, charging: 3, color: "green" },
        { model: "Pin Lỗi", type: "Cần báo cáo", total: 3, pending: 2, color: "red" },
      ].map((item) => (
        <div key={item.model} className="flex justify-between items-center py-2 border-b last:border-b-0">
          <div className="flex items-center">
            <svg className={`w-5 h-5 text-${item.color}-600 mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <div>
              <p className="font-semibold">{item.model} ({item.type})</p>
              <p className="text-sm text-gray-500">Tổng: {item.total} pin</p>
            </div>
          </div>
          <div className="text-right">
            {item.full && <span className="text-sm font-medium text-green-700">Đầy: {item.full}</span>}
            {item.charging && <p className="text-xs text-yellow-600 mt-1">Đang sạc: {item.charging}</p>}
            {item.maintenance && <p className="text-xs text-red-600 mt-1">Bảo dưỡng: {item.maintenance}</p>}
            {item.pending && <span className="text-sm font-medium text-red-700">Chưa xử lý: {item.pending}</span>}
          </div>
        </div>
      ))}
    </div>
  );

  // render based on type
  if (type === "inventory") {
    return <InventoryStatus />;
  }
}


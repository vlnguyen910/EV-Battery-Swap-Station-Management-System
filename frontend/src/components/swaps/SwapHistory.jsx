// SwapHistory component
export default function SwapHistory({ type = "swap" }) {
  const RecentTransactions = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Giao dịch Đổi Pin Gần đây</h3>

      {[
        { id: "TXN009", name: "John Smith", model: "Model X", from: "BAT015", status: "Hoàn thành", color: "green" },
        { id: "TXN010", name: "Emma Wilson", model: "Model Y", from: "BAT022", status: "Thanh toán", color: "yellow" },
        { id: "TXN011", name: "Nguyễn Văn A", model: "Model X", from: "BAT040", status: "Đang xử lý", color: "blue" },
      ].map((txn) => (
        <div key={txn.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
          <div>
            <p className="font-semibold">{txn.id} - {txn.name}</p>
            <p className="text-sm text-gray-500">{txn.model} | Từ {txn.from}</p>
          </div>
          <div className="text-right">
            <span className={`text-sm font-medium text-${txn.color}-700 bg-${txn.color}-100 px-3 py-1 rounded-full`}>
              {txn.status}
            </span>
            <p className="text-xs text-gray-400 mt-1">10:45</p>
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "swap") {
    return <RecentTransactions />;
  }


}


// Card component
export default function Card({ type = "card" }) {
  const MetricsCards = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {/* Tổng Giao dịch Hôm nay */}
      <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold opacity-75">Giao dịch Hôm nay</h3>
          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <p className="text-3xl font-bold mt-2">124</p>
        <p className="text-xs text-green-400 mt-1">+8 so với hôm qua</p>
      </div>

      {/* Pin Đầy sẵn sàng */}
      <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold opacity-75">Pin Đầy (Full)</h3>
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-3xl font-bold mt-2">18</p>
        <p className="text-xs text-yellow-400 mt-1">2 đang chờ sạc</p>
      </div>

      {/* Pin Đang sạc */}
      <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold opacity-75">Pin Đang Sạc</h3>
          <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-3xl font-bold mt-2">4</p>
        <p className="text-xs text-red-400 mt-1">1 lỗi cần bảo dưỡng</p>
      </div>

      {/* Pin Bảo dưỡng */}
      <div className="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold opacity-75">Pin Bảo dưỡng</h3>
          <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-3xl font-bold mt-2">3</p>
        <p className="text-xs text-red-400 mt-1">2 cần kiểm tra hôm nay</p>
      </div>
    </div>
  );

  // card type
  if (type === "metrics") {
    return <MetricsCards />;
  }
}

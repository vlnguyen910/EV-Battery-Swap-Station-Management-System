import React from 'react';

export default function StationInfoPanel({ 
  stationInfo, 
  bookingState,
  timeRemaining,
  onConfirmBooking,
  onCancelBooking,
  showCancelDialog,
  onConfirmCancel,
  onCancelDialogClose
}) {
  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = Math.round((stationInfo.availableSlots / stationInfo.totalSlots) * 100);

  return (
    <div className="bg-white p-6">
      {/* Battery Availability Status */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-medium">Pin còn lại</span>
          <span className="text-lg font-bold text-gray-900">
            {stationInfo.availableSlots}/{stationInfo.totalSlots}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Booking State UI */}
      {bookingState === 'idle' ? (
        /* Before Booking - Show Confirm Booking Button */
        <button
          onClick={onConfirmBooking}
          disabled={stationInfo.availableSlots === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors shadow-md"
        >
          Xác Nhận Đặt Lịch
        </button>
      ) : (
        /* After Booking - Show Countdown Timer and Cancel */
        <div className="space-y-4">
          {/* Section Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
           Vui lòng đến trạm trong thời gian sau để thực hiện việc hoán đổi pin
          </h3>

          {/* Countdown Timer Display */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
            <p className="text-gray-700 mb-3 font-medium text-lg">Thời gian còn lại</p>
            <div className="text-6xl font-bold text-blue-600 mb-2 font-mono">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-gray-600">phút</p>
          </div>

          {/* Confirm Booking Status */}
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center text-green-700">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold text-lg">Đã Xác Nhận Đặt Lịch</span>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancelBooking}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Hủy Đặt Lịch
          </button>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận hủy đặt lịch</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy đặt lịch này không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancelDialogClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Không
              </button>
              <button
                onClick={onConfirmCancel}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Có, hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
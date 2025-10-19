import React from 'react';
import BookingSuccessHeader from './BookingSuccessHeader';
import CountdownTimer from './CountdownTimer';
import StationInfoCard from './StationInfoCard';
import InstructionsCard from './InstructionsCard';

export default function BookingSuccessView({
  stationName,
  stationAddress,
  availableSlots,
  totalSlots,
  timeRemaining,
  bookingTime,
  onCancelBooking,
  showCancelDialog,
  onConfirmCancel,
  onCancelDialogClose
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <BookingSuccessHeader />
        
        <CountdownTimer timeRemaining={timeRemaining} />

        {/* Station Info & Instructions in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <StationInfoCard
            stationName={stationName}
            stationAddress={stationAddress}
            availableSlots={availableSlots}
            totalSlots={totalSlots}
            bookingTime={bookingTime}
          />
          
          <InstructionsCard />
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancelBooking}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>✕</span>
          <span>Hủy Đặt Lịch</span>
        </button>

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
    </div>
  );
}

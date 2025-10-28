import React from 'react';
import { Battery, CheckCircle2, XCircle } from 'lucide-react';

export default function StationInfoPanel({
  stationInfo,
  bookingState,
  timeRemaining,
  onConfirmBooking,
  onCancelBooking,
  showCancelDialog,
  onConfirmCancel,
  onCancelDialogClose,
  selectedVehicleHasSubscription
  , selectedVehicleBatteryModel
}) {


  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = Math.round((stationInfo.availableSlots / stationInfo.totalSlots) * 100);

  // Determine available batteries at this station that are 'full'
  const availableBatteries = Array.isArray(stationInfo.batteries) ? stationInfo.batteries.filter(b => String(b.status || '').toLowerCase() === 'full') : [];

  // If a selected vehicle battery model is provided, filter batteries by model compatibility
  const modelMatches = (battery, model) => {
    if (!model) return true; // no filter
    const bModel = battery?.battery_model ?? battery?.model ?? battery?.batteryModel ?? '';
    return String(bModel).toLowerCase() === String(model).toLowerCase();
  };

  const compatibleBatteries = availableBatteries.filter(b => modelMatches(b, selectedVehicleBatteryModel));

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      {/* Battery Availability Status */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-semibold text-lg">Available Batteries</span>
          </div>
          <span className="text-2xl font-bold text-blue-800">
            {availableBatteries.length}/{stationInfo.totalSlots}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-blue-800 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Compatible batteries message */}
        <div className="mt-4">
          {selectedVehicleBatteryModel ? (
            <p className="text-sm text-gray-700">There are <span className="text-green-600 font-semibold">{compatibleBatteries.length}</span> batteries available that match your vehicle (<strong>{selectedVehicleBatteryModel}</strong>).</p>
          ) : (
            <p className="text-sm text-gray-600">Showing all available batteries: {availableBatteries.length}</p>
          )}
        </div>
      </div>

      {/* Booking State UI */}
      {bookingState === 'idle' ? (
        /* Before Booking - Show Confirm Booking Button */
        <>
          <button
            onClick={onConfirmBooking}
            disabled={
              stationInfo.availableSlots === 0 ||
              !selectedVehicleHasSubscription ||
              (selectedVehicleBatteryModel && compatibleBatteries.length === 0)
            }
            className="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={22} />
            Confirm Booking
          </button>
          {!selectedVehicleHasSubscription && (
            <p className="text-sm mt-3 text-yellow-700 text-center">Selected vehicle has no active subscription — booking is disabled. <button onClick={() => window.location.href = '/driver/plans'} className="underline">View plans</button></p>
          )}
          {selectedVehicleBatteryModel && compatibleBatteries.length === 0 && (
            <p className="text-sm mt-3 text-yellow-700 text-center">No compatible batteries available for this vehicle. Please select another station.</p>
          )}
        </>
      ) : (
        /* After Booking - Show Countdown Timer and Cancel */
        <div className="space-y-5">
          {/* Section Title */}
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Please arrive at the station within the time limit to complete the battery swap
          </h3>

          {/* Countdown Timer Display */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-8 text-center shadow-lg">
            <p className="text-gray-700 mb-3 font-semibold text-lg">Time Remaining</p>
            <div className="text-7xl font-bold text-blue-800 mb-2 font-mono">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-gray-600 font-medium">minutes</p>
          </div>

          {/* Confirm Booking Status */}
          <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5 text-center shadow-md">
            <div className="flex items-center justify-center text-green-700">
              <CheckCircle2 className="w-7 h-7 mr-2" strokeWidth={2.5} />
              <span className="font-bold text-xl">Booking Confirmed</span>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancelBooking}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <XCircle size={20} />
            Cancel Booking
          </button>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancelDialogClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                No
              </button>
              <button
                onClick={onConfirmCancel}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
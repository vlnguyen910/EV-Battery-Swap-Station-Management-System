import React from 'react';

export default function BookingConfirmButton({ 
  selectedTimeSlot, 
  availableSlots, 
  onContinueToConfirmation 
}) {
  const isDisabled = !selectedTimeSlot || availableSlots === 0;
  
  const getButtonText = () => {
    if (availableSlots === 0) return 'No Batteries Available';
    if (selectedTimeSlot) return 'Continue to confirmation';
    return 'Select time slot to continue';
  };

  return (
    <div>
      <button
        onClick={onContinueToConfirmation}
        disabled={isDisabled}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          selectedTimeSlot && availableSlots > 0
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {getButtonText()}
      </button>
      
      {availableSlots > 0 && !selectedTimeSlot && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          {availableSlots} fully charged batteries ready
        </p>
      )}
    </div>
  );
}
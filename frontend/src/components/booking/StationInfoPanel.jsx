import React from 'react';
import AvailableSlotsCard from './AvailableSlotsCard';
import BatteryStatusGrid from './BatteryStatusGrid';
import BookingConfirmButton from './BookingConfirmButton';

export default function StationInfoPanel({ 
  stationInfo, 
  selectedTimeSlot, 
  onContinueToConfirmation 
}) {
  return (
    <div className="p-6 flex-1">
      <h3 className="text-lg font-medium text-green-600 mb-4">Station information</h3>
      
      <AvailableSlotsCard 
        availableSlots={stationInfo.availableSlots}
        totalSlots={stationInfo.totalSlots}
      />

      <BatteryStatusGrid batteries={stationInfo.batteries} />

      <BookingConfirmButton
        selectedTimeSlot={selectedTimeSlot}
        availableSlots={stationInfo.availableSlots}
        onContinueToConfirmation={onContinueToConfirmation}
      />
    </div>
  );
}
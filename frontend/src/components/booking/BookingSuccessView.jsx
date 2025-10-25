import React from 'react';
import BookingSuccessHeader from './BookingSuccessHeader';
import StationInfoCard from './StationInfoCard';
import InstructionsCard from './InstructionsCard';

export default function BookingSuccessView({
  stationName,
  stationAddress,
  availableSlots,
  totalSlots,
  timeRemaining,
  bookingTime,
  
}) {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <BookingSuccessHeader />
        
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

      </div>
    </div>
  );
}

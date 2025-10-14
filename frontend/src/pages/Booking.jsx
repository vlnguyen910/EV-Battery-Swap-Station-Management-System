import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookingHeader from '../components/booking/BookingHeader';
import StationInfoPanel from '../components/booking/StationInfoPanel';
import TimeSlotGrid from '../components/booking/TimeSlotGrid';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  // Get station info from URL parameters
  const stationId = searchParams.get('stationId');
  const stationName = searchParams.get('name') || 'Station name';
  const stationAddress = searchParams.get('address') || 'address';
  const availableBatteries = parseInt(searchParams.get('availableBatteries')) || 0;
  const totalBatteries = parseInt(searchParams.get('totalBatteries')) || 0;
  const stationStatus = searchParams.get('status') || 'Unknown';

  // Generate battery data based on station information
  const generateBatteryData = (available, total) => {
    const batteries = [];
    for (let i = 1; i <= total; i++) {
      const isAvailable = i <= available;
      batteries.push({
        id: i,
        level: isAvailable ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 60) + 20, // Available: 80-100%, Charging: 20-80%
        status: isAvailable ? 'charged' : 'charging',
        isAvailable: isAvailable
      });
    }
    return batteries;
  };

  // Station information based on URL parameters and generated data
  const [stationInfo, setStationInfo] = useState({
    totalSlots: totalBatteries,
    availableSlots: availableBatteries,
    batteries: generateBatteryData(availableBatteries, totalBatteries)
  });

  // Update station info when URL parameters change
  useEffect(() => {
    setStationInfo({
      totalSlots: totalBatteries,
      availableSlots: availableBatteries,
      batteries: generateBatteryData(availableBatteries, totalBatteries)
    });
  }, [availableBatteries, totalBatteries]);

  // Time slots for booking
  const timeSlots = [
    '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00'
  ];

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleContinueToConfirmation = () => {
    if (selectedTimeSlot) {
      // Navigate to confirmation page or show confirmation modal
      console.log('Booking confirmed for:', {
        station: stationName,
        timeSlot: selectedTimeSlot,
        date: new Date().toLocaleDateString()
      });
      // You can navigate to a confirmation page or show success message
      alert(`Booking confirmed for ${stationName} at ${selectedTimeSlot}`);
    }
  };

  const handleBackToMap = () => {
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Station Information */}
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        <BookingHeader 
          stationName={stationName}
          stationAddress={stationAddress}
          onBackToMap={handleBackToMap}
        />

        <StationInfoPanel
          stationInfo={stationInfo}
          selectedTimeSlot={selectedTimeSlot}
          onContinueToConfirmation={handleContinueToConfirmation}
        />
      </div>

      {/* Right Panel - Time Slot Selection */}
      <div className="w-1/2 p-8 bg-gray-50">
        <TimeSlotGrid
          timeSlots={timeSlots}
          selectedTimeSlot={selectedTimeSlot}
          onTimeSlotSelect={handleTimeSlotSelect}
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookingHeader from '../components/booking/BookingHeader';
import StationInfoPanel from '../components/booking/StationInfoPanel';
import BookingSuccessView from '../components/booking/BookingSuccessView';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Booking state: 'idle' | 'booked'
  const [bookingState, setBookingState] = useState('idle');
  
  // Countdown timer (in seconds, starts at 60 minutes = 3600 seconds)
  const [timeRemaining, setTimeRemaining] = useState(3600);
  
  // Show cancel confirmation dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Booking time
  const [bookingTime, setBookingTime] = useState('');
  
  // Get station info from URL parameters
  const stationId = searchParams.get('stationId');
  const stationName = searchParams.get('name') || 'Trạm Pin Quận 1';
  const stationAddress = searchParams.get('address') || '123 Nguyễn Huệ, Quận 1, TP.HCM';
  const availableBatteries = parseInt(searchParams.get('availableBatteries')) || 8;
  const totalBatteries = parseInt(searchParams.get('totalBatteries')) || 12;

  // Generate battery data based on station information
  const generateBatteryData = (available, total) => {
    const batteries = [];
    for (let i = 1; i <= total; i++) {
      const isAvailable = i <= available;
      batteries.push({
        id: i,
        level: isAvailable ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 60) + 20,
        status: isAvailable ? 'charged' : 'charging',
        isAvailable: isAvailable
      });
    }
    return batteries;
  };

  // Station information
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

  // Countdown timer effect
  useEffect(() => {
    if (bookingState === 'booked' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time expired, reset booking
            setBookingState('idle');
            return 3600;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [bookingState, timeRemaining]);

  const handleConfirmBooking = () => {
    setBookingState('booked');
    setTimeRemaining(3600); // Reset to 60 minutes
    // Set booking time
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setBookingTime(formattedTime);
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setBookingState('idle');
    setTimeRemaining(3600);
    setShowCancelDialog(false);
    setBookingTime('');
  };

  const handleCancelDialogClose = () => {
    setShowCancelDialog(false);
  };

  const handleBackToMap = () => {
    navigate('/driver/map');
  };

  // Success Screen UI
  if (bookingState === 'booked') {
    return (
      <BookingSuccessView
        stationName={stationName}
        stationAddress={stationAddress}
        availableSlots={availableBatteries}
        totalSlots={totalBatteries}
        timeRemaining={timeRemaining}
        bookingTime={bookingTime}
        onCancelBooking={handleCancelClick}
        showCancelDialog={showCancelDialog}
        onConfirmCancel={handleConfirmCancel}
        onCancelDialogClose={handleCancelDialogClose}
      />
    );
  }

  // Booking Form UI (when state is 'idle')
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto overflow-hidden">
        <BookingHeader 
          stationName={stationName}
          stationAddress={stationAddress}
          onBackToMap={handleBackToMap}
        />
        
        {/* Station Image */}
        <div className="bg-white px-6">
          <img
            src="https://readdy.ai/api/search-image?query=modern%20electric%20battery%20charging%20station%20with%20green%20energy%20technology%2C%20clean%20white%20background%2C%20professional%20lighting%2C%20high-tech%20equipment%20with%20digital%20displays%20showing%20battery%20levels&width=400&height=300&seq=station1&orientation=landscape"
            alt="Battery Charging Station"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      
        <StationInfoPanel
          stationInfo={stationInfo}
          bookingState={bookingState}
          timeRemaining={timeRemaining}
          onConfirmBooking={handleConfirmBooking}
          onCancelBooking={handleCancelClick}
          showCancelDialog={showCancelDialog}
          onConfirmCancel={handleConfirmCancel}
          onCancelDialogClose={handleCancelDialogClose}
        />
      </div>
    </div>
  );
}

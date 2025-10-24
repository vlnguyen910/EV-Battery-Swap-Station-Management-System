import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Booking from '../../pages/Booking';
import { useAuth, useStation, useReservation, useSubscription } from '../../hooks/useContext';

export default function BookingContainer() {
  const { stationId } = useParams();
  const { user } = useAuth();
  const { getStationById } = useStation();
  const { createReservation } = useReservation();
  const { activeSubscription, getActiveSubscription } = useSubscription();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bookingState, setBookingState] = useState('idle');
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingTime, setBookingTime] = useState('');
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);


  const [stationInfo, setStationInfo] = useState({
    station_id: stationId ? Number(stationId) : null,
    name: '',
    address: '',
    totalSlots: 0,
    availableSlots: 0,
    batteries: []
  });

  // Load station data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!stationId) return;
      try {
        const res = await getStationById(Number(stationId));
        const st = res?.data ?? res ?? null;
        if (!st) return;
        const batteriesArr = Array.isArray(st.batteries) ? st.batteries : [];
        const total = batteriesArr.length;
        const available = batteriesArr.filter(b => String(b.status || '').toLowerCase() === 'full').length;
        if (mounted) {
          setStationInfo({
            station_id: st.station_id ?? st.id,
            name: st.name ?? '',
            address: st.address ?? '',
            totalSlots: total,
            availableSlots: available,
            batteries: batteriesArr
          });
        }
      } catch (err) {
        console.error('Failed to load station data', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [stationId, getStationById]);

  // Check user's active subscription on mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user?.id) {
        setSubscriptionLoading(false);
        return;
      }

      try {
        await getActiveSubscription(user.id);
        setSubscriptionLoading(false);
      } catch (err) {
        console.error('No active subscription found', err);
        setSubscriptionLoading(false);
      }
    };

    checkSubscription();
  }, [user?.id, getActiveSubscription]);

  // Timer for booking countdown
  useEffect(() => {
    if (bookingState === 'booked' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setBookingState('idle');
            return 3600;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [bookingState, timeRemaining]);

  const handleConfirmBooking = async () => {
    const station_id = stationInfo?.station_id || (stationId ? Number(stationId) : null);
    if (!station_id) {
      console.error('No station selected for booking');
      return;
    }

    // Check if user has active subscription
    if (!activeSubscription) {
      alert('You need an active subscription to book a battery swap. Please subscribe to a plan first.');
      navigate('/driver/plans');
      return;
    }

    // Check if batteries are available
    const availableBatteries = (stationInfo.batteries || []).filter(b => String(b.status || '').toLowerCase() === 'full');
    if (availableBatteries.length === 0) {
      alert('No available batteries at this station');
      return;
    }

    // Backend DTO only requires: user_id, station_id, scheduled_time
    try {
      // Schedule time must be in the future - add 5 minutes from now
      const scheduledTime = new Date();
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 5);

      const payload = {
        user_id: user?.id ?? user?.user_id,
        station_id,
        scheduled_time: scheduledTime.toISOString()
      };

      console.log('Creating reservation with payload:', payload);
      console.log('User object:', user);

      const created = await createReservation(payload);
      console.log('Reservation created successfully:', created);
      console.log('Reservation status should be: scheduled');

      if (created) {
        setBookingState('booked');
        setTimeRemaining(3600);
        const now = new Date();
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setBookingTime(formattedTime);
      }
    } catch (err) {
      console.error('Failed to create reservation', err);
      console.error('Error response:', err.response?.data);

      // Check if reservation already exists
      if (err.response?.data?.message?.includes('already have a reservation')) {
        alert('You already have an active reservation. Please complete or cancel it first.');
        // Optionally navigate to show existing reservation
      } else {
        alert('Failed to create reservation: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      }
    }
  };

  const handleCancelClick = () => setShowCancelDialog(true);

  const handleConfirmCancel = () => {
    setBookingState('idle');
    setTimeRemaining(3600);
    setShowCancelDialog(false);
    setBookingTime('');
  };

  const handleCancelDialogClose = () => setShowCancelDialog(false);

  const handleBackToMap = () => navigate('/driver/map');

  const handleNavigateToPlans = () => navigate('/driver/plans');

  return (
    <Booking
      // State
      stationInfo={stationInfo}
      bookingState={bookingState}
      timeRemaining={timeRemaining}
      showCancelDialog={showCancelDialog}
      bookingTime={bookingTime}
      subscriptionLoading={subscriptionLoading}
      activeSubscription={activeSubscription}

      // Handlers
      onConfirmBooking={handleConfirmBooking}
      onCancelClick={handleCancelClick}
      onConfirmCancel={handleConfirmCancel}
      onCancelDialogClose={handleCancelDialogClose}
      onBackToMap={handleBackToMap}
      onNavigateToPlans={handleNavigateToPlans}
    />
  );
}
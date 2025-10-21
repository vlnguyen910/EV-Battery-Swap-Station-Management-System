import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookingHeader from '../components/booking/BookingHeader';
import StationInfoPanel from '../components/booking/StationInfoPanel';
import BookingSuccessView from '../components/booking/BookingSuccessView';
import { useAuth, useStation, useReservation, useSubscription } from '../hooks/useContext';

export default function Booking() {
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

  const stationId = searchParams.get('stationId');

  const [stationInfo, setStationInfo] = useState({
    station_id: stationId ? Number(stationId) : null,
    name: '',
    address: '',
    totalSlots: 0,
    availableSlots: 0,
    batteries: []
  });

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
      alert('Failed to create reservation: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    }
  };

  const handleCancelClick = () => setShowCancelDialog(true);
  const handleConfirmCancel = () => { setBookingState('idle'); setTimeRemaining(3600); setShowCancelDialog(false); setBookingTime(''); };
  const handleCancelDialogClose = () => setShowCancelDialog(false);
  const handleBackToMap = () => navigate('/driver/map');

  if (bookingState === 'booked') {
    return (
      <BookingSuccessView
        stationName={stationInfo.name}
        stationAddress={stationInfo.address}
        availableSlots={stationInfo.availableSlots}
        totalSlots={stationInfo.totalSlots}
        timeRemaining={timeRemaining}
        bookingTime={bookingTime}
        onCancelBooking={handleCancelClick}
        showCancelDialog={showCancelDialog}
        onConfirmCancel={handleConfirmCancel}
        onCancelDialogClose={handleCancelDialogClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <BookingHeader stationName={stationInfo.name} stationAddress={stationInfo.address} onBackToMap={handleBackToMap} />

          <div className="relative px-6 pb-6">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img src={stationInfo.image || 'https://selex.vn/wp-content/uploads/2024/11/Group-1000002977-1.png'} alt={stationInfo.name || 'Station'} className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Subscription Status Banner */}
          {subscriptionLoading ? (
            <div className="px-6 pb-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-600">Checking subscription status...</p>
              </div>
            </div>
          ) : !activeSubscription ? (
            <div className="px-6 pb-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 font-medium">
                      No active subscription found
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      You need to subscribe to a plan before booking a battery swap.
                    </p>
                    <button
                      onClick={() => navigate('/driver/plans')}
                      className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-800 underline"
                    >
                      View Plans →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 pb-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 font-medium">
                      Active Subscription: {activeSubscription?.package?.package_name || 'Premium Plan'}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Swaps remaining: {activeSubscription?.remaining_swap_count ?? 'Unlimited'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
}

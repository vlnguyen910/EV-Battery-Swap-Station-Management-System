import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Booking from '../../pages/Booking';
import { useAuth, useStation, useReservation, useSubscription, useVehicle } from '../../hooks/useContext';

export default function BookingContainer() {
  const { stationId } = useParams();
  const { user } = useAuth();
  const { getStationById } = useStation();
  const { createReservation } = useReservation();
  const { subscriptions, activeSubscription, getActiveSubscription } = useSubscription();
  const { vehicles, loading: vehiclesLoading } = useVehicle();
  const navigate = useNavigate();

  console.log('BookingContainer render - user:', user, 'user.id:', user?.id, 'vehicles:', vehicles.length, 'vehiclesLoading:', vehiclesLoading, 'subscriptions:', subscriptions.length);

  const [bookingState, setBookingState] = useState('idle');
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingTime, setBookingTime] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedVehicleSubscription, setSelectedVehicleSubscription] = useState(null);


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
    if (user?.id) {
      console.log('BookingContainer: Fetching activeSubscription for user:', user.id);
      getActiveSubscription(user.id).catch(err => {
        console.error('BookingContainer: Failed to fetch activeSubscription', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Normalize subscriptions with __normalizedVehicleId for easier matching
  const normalizedSubscriptions = useMemo(() => {
    return (subscriptions || []).map(s => {
      const rawVid = s.vehicle_id ?? s.vehicle?.vehicle_id ?? s.vehicle?.id ?? s.vehicleId ?? s.vehicle?.vehicleId;
      const normalizedVid = rawVid !== undefined && rawVid !== null ? Number(rawVid) : undefined;
      return { ...s, __normalizedVehicleId: normalizedVid };
    });
  }, [subscriptions]);

  console.log('BookingContainer: normalizedSubscriptions:', normalizedSubscriptions);

  // Auto-select first vehicle when vehicles load
  useEffect(() => {
    if (vehicles && vehicles.length > 0 && !selectedVehicleId) {
      const firstId = vehicles[0].vehicle_id ?? vehicles[0].id;
      setSelectedVehicleId(firstId);
      console.log('BookingContainer: Auto-selected first vehicle:', firstId, 'from vehicles:', vehicles);
    }
  }, [vehicles, selectedVehicleId]);

  // Match subscription to selected vehicle
  useEffect(() => {
    console.log('BookingContainer: Matching subscription - selectedVehicleId:', selectedVehicleId, 'normalizedSubscriptions:', normalizedSubscriptions);
    if (selectedVehicleId && normalizedSubscriptions.length > 0) {
      const matched = normalizedSubscriptions.find(s => {
        const matches = s.__normalizedVehicleId === Number(selectedVehicleId);
        console.log('  - Checking subscription:', s.subscription_id, '__normalizedVehicleId:', s.__normalizedVehicleId, 'matches:', matches);
        return matches;
      });
      setSelectedVehicleSubscription(matched || null);
      console.log('BookingContainer: ✓ Matched subscription for vehicle:', selectedVehicleId, '→', matched);
    } else if (selectedVehicleId && normalizedSubscriptions.length === 0) {
      console.log('BookingContainer: ⚠️ No subscriptions available yet for vehicle:', selectedVehicleId);
      setSelectedVehicleSubscription(null);
    }
  }, [selectedVehicleId, normalizedSubscriptions]);

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

  const handleVehicleChange = (vehicleId) => {
    // ensure id is numeric (select gives string), log for debugging
    const vid = Number(vehicleId);
    setSelectedVehicleId(vid);
    const matched = normalizedSubscriptions.find(
      (s) => s.__normalizedVehicleId === vid || Number(s.vehicle_id) === vid
    );
    setSelectedVehicleSubscription(matched || null);
  };

  const handleConfirmBooking = async () => {
    // Prefer vehicle-specific subscription when available
    const subscriptionToUse = selectedVehicleSubscription ?? activeSubscription;
    const station_id = stationInfo?.station_id || (stationId ? Number(stationId) : null);
    if (!station_id) {
      console.error('No station selected for booking');
      return;
    }

    // Check if user has selected a vehicle
    if (!selectedVehicleId) {
      alert('Please select a vehicle first');
      return;
    }

    // Check if user has active subscription (for selected vehicle)
    if (!subscriptionToUse) {
      alert('You need an active subscription for the selected vehicle to book a battery swap. Please subscribe to a plan first.');
      navigate('/driver/plans');
      return;
    }

    // Check if batteries are available
    const availableBatteries = (stationInfo.batteries || []).filter(b => String(b.status || '').toLowerCase() === 'full');
    if (availableBatteries.length === 0) {
      alert('No available batteries at this station');
      return;
    }

    // Backend DTO requires: user_id, vehicle_id, station_id, scheduled_time
    try {
      // Schedule time must be in the future - add 5 minutes from now
      const scheduledTime = new Date();
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 5);

      const payload = {
        user_id: user?.id ?? user?.user_id,
        vehicle_id: selectedVehicleId,
        station_id,
        scheduled_time: scheduledTime.toISOString(),
      };

      console.log('Creating reservation with payload:', payload);
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
      // Map some backend messages to friendlier UI flows
      const serverMsg = err.response?.data?.message || '';

      if (typeof serverMsg === 'string' && serverMsg.includes('already have a reservation')) {
        alert('You already have an active reservation. Please complete or cancel it first.');
        return;
      }

      if (typeof serverMsg === 'string' && serverMsg.includes('does not have an active subscription')) {
        // Guide user to subscription plans
        if (window.confirm('Your vehicle does not have an active subscription. Would you like to view plans?')) {
          navigate('/driver/plans');
        }
        return;
      }

      if (typeof serverMsg === 'string' && serverMsg.includes('Not found driver vehicle')) {
        alert('No active vehicle found for your account. Please register or activate a vehicle before booking.');
        return;
      }

      alert('Failed to create reservation: ' + (serverMsg || err.message || 'Unknown error'));
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
      subscriptionLoading={false}
      vehiclesLoading={vehiclesLoading}
      activeSubscription={activeSubscription}
      // vehicle related
      vehicles={vehicles}
      selectedVehicleId={selectedVehicleId}
      onVehicleChange={handleVehicleChange}
      selectedVehicleSubscription={selectedVehicleSubscription}

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
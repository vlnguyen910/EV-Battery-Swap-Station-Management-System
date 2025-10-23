import WelcomeHeader from './WelcomeHeader'
import VehicleStatus from './VehicleStatus'
import DriverStats from './DriverStats'
import NearbyStations from './NearbyStations'
import RecentActivity from './RecentActivity'
import NeedHelp from './NeedHelp'
import { useAuth, useSubscription } from '../../hooks/useContext';
import { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { reservationService } from '../../services/reservationService';

export default function DriverDashboard() {
    const { user } = useAuth();
    const { activeSubscription, getActiveSubscription } = useSubscription();
    const [vehicleData, setVehicleData] = useState(null);

    // Fetch user's active subscription on component mount
    useEffect(() => {
        const fetchActiveSubscription = async () => {
            if (!user?.id) return;

            try {
                await getActiveSubscription(user.id);
            } catch (error) {
                console.error('Error fetching active subscription:', error);
            }
        };

        fetchActiveSubscription();
    }, [user?.id, getActiveSubscription]);

    // Fetch vehicle data when subscription is loaded
    useEffect(() => {
        const fetchVehicleData = async () => {
            if (!activeSubscription?.vehicle_id) return;

            try {
                console.log('Fetching vehicle with ID:', activeSubscription.vehicle_id);
                const vehicle = await vehicleService.getVehicleById(activeSubscription.vehicle_id);
                console.log('Vehicle data fetched:', vehicle);
                setVehicleData(vehicle);
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
                // If fetch fails, create minimal vehicle data from subscription
                console.warn('Using vehicle_id from subscription instead');
                setVehicleData({
                    vehicle_id: activeSubscription.vehicle_id,
                    user_id: user.id,
                    battery_id: null, // Will be populated if needed
                    vin: 'N/A', // VIN not available
                });
            }
        };

        if (activeSubscription) {
            fetchVehicleData();
        }
    }, [activeSubscription, user?.id]);

    const handleManualSwap = async () => {
        // Debug: Log current state
        console.log('=== Manual Swap Button Clicked ===');
        console.log('user:', user);
        console.log('activeSubscription:', activeSubscription);
        console.log('vehicleData:', vehicleData);

        // Validate user is logged in
        if (!user) {
            alert('Please login to request manual swap');
            return;
        }

        // Validate subscription exists
        if (!activeSubscription) {
            alert('You need an active subscription to swap batteries');
            console.error('No active subscription found for user:', user.id);
            return;
        }

        // Get vehicle_id from subscription (no need to fetch vehicle separately!)
        const vehicleId = activeSubscription.vehicle_id;
        if (!vehicleId) {
            alert('No vehicle associated with your subscription');
            return;
        }

        try {
            // Create reservation with status="scheduled"
            // Use vehicle data from subscription and fetch if available
            const batteryId = vehicleData?.battery_id || null;

            const reservationData = {
                user_id: user.id,
                vehicle_id: vehicleId, // From subscription
                battery_id: batteryId, // From vehicle data if fetched
                station_id: 1, // Default station (or let user choose)
                scheduled_time: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
                // status will be 'scheduled' by default from backend
            };

            console.log('Creating reservation:', reservationData);
            const reservation = await reservationService.createReservation(reservationData);
            console.log('Reservation created:', reservation);

            alert('Manual swap request sent to station staff! Reservation ID: ' + reservation.reservation_id);
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert('Failed to create swap request: ' + (error.response?.data?.message || error.message));
        }
    }; const handleAutoSwap = () => {
        // Auto swap functionality - to be implemented
        alert('Auto swap feature coming soon!');
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Main 2-Column Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-6 pt-2">
                {/* Left Column - Welcome Header + Vehicle Status + Recent Activity */}
                <div className="space-y-6">
                    <WelcomeHeader
                        userName={user?.name}
                        onManualSwap={handleManualSwap}
                        onAutoSwap={handleAutoSwap}
                    />
                    <VehicleStatus />
                    <RecentActivity />
                </div>

                {/* Right Column - Driver Stats + Nearby Stations */}
                <div className="space-y-6">
                    <DriverStats />
                    <NearbyStations />
                    <NeedHelp />
                </div>
            </div>
        </div>
    )
}
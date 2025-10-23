import WelcomeHeader from './WelcomeHeader'
import VehicleStatus from './VehicleStatus'
import DriverStats from './DriverStats'
import NearbyStations from './NearbyStations'
import RecentActivity from './RecentActivity'
import NeedHelp from './NeedHelp'
import SwapSuccessDialog from './SwapSuccessDialog'
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

    const [showSwapSuccess, setShowSwapSuccess] = useState(false);

    const handleAutoSwap = () => {
        // TODO: integrate real auto-swap flow; for now, show success dialog
        setShowSwapSuccess(true);
    };

    const handleManualSwap = () => {
        // Placeholder: navigate to booking/map or open manual flow
        // e.g., navigate('/driver/map') if navigation available here
        console.log('Manual swap clicked');
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

            <SwapSuccessDialog
                open={showSwapSuccess}
                onOpenChange={setShowSwapSuccess}
                summary={{
                    user: user?.name || 'Unknown',
                    station: 'Central Charging Hub', // TODO: bind real selected station if available
                    vehicle: vehicleData?.model ? `${vehicleData.model}` : (vehicleData?.vin || 'Unknown vehicle'),
                    plan: activeSubscription?.package_name || 'Active Subscription',
                }}
            />
        </div>
    )
}
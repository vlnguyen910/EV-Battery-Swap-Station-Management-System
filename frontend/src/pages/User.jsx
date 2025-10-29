import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useStation, useAuth, useSubscription } from '../hooks/useContext';
import { vehicleService } from '../services/vehicleService';
import DashboardHeader from '../components/user/DashboardHeader';
import VehicleStatusCard from '../components/user/VehicleStatusCard';
import RecentActivityCard from '../components/user/RecentActivityCard';
import MonthSummaryCard from '../components/user/MonthSummaryCard';
import NearbyStationsCard from '../components/user/NearbyStationsCard';
import HelpLinksCard from '../components/user/HelpLinksCard';
import SwapSuccessDialog from '../components/dashboard/SwapSuccessDialog';

export default function User() {
  const navigate = useNavigate();
  const { stations } = useStation();
  const { user } = useAuth();
  const { activeSubscription, getActiveSubscription } = useSubscription();
  const [vehicleData, setVehicleData] = useState([]);
  const [showSwapSuccess, setShowSwapSuccess] = useState(false);

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

  // Fetch vehicle data by user ID
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!user?.id) return;

      try {
        console.log('Fetching enriched vehicles for user ID:', user.id);
        const vehicles = await vehicleService.getVehiclesByUserIdWithBattery(user.id);
        console.log('Enriched vehicle data fetched:', vehicles);
        setVehicleData(Array.isArray(vehicles) ? vehicles : []);
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
        setVehicleData([]);
      }
    };

    fetchVehicleData();
  }, [user?.id]);

  const headerName = user?.name || 'Driver';

  const nearbyStations = useMemo(() => {
    if (!Array.isArray(stations)) return [];
    // pick first 3 for preview; could be sorted by distance if available
    return stations.slice(0, 3).map((s) => ({
      id: s.station_id ?? s.id,
      name: s.name || 'Unnamed Station',
      address: s.address || '',
      available: s.availableBatteries ?? (Array.isArray(s.batteries) ? s.batteries.filter(b => String(b.status || '').toLowerCase() === 'full').length : 0),
      total: s.totalBatteries ?? (Array.isArray(s.batteries) ? s.batteries.length : 0),
    }));
  }, [stations]);

  const handleAutoSwap = () => {
    // TODO: integrate real auto-swap flow; for now, show success dialog
    setShowSwapSuccess(true);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background to match Driver.jsx style */}
      <div
        className="absolute inset-0 z-0 hidden"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 5% 40%, #ffffffdc, transparent 67%),
            radial-gradient(ellipse 70% 60% at 45% 45%, #6699ff69, transparent 67%),
            radial-gradient(ellipse 62% 52% at 83% 76%, #b9e2ffb4, transparent 63%),
            radial-gradient(ellipse 60% 48% at 75% 20%, #eff1f8bc, transparent 66%),
            linear-gradient(45deg, #eaeeffff 0%, #ffffffff 100%)
          `,
        }}
      />

      <div className="min-h-screen relative z-10">
        <Sidebar />
        <main className="px-16 py-5 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <DashboardHeader name={headerName} onAutoSwap={handleAutoSwap} />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Left column */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <VehicleStatusCard vehicles={vehicleData} onFindStations={() => navigate('/driver/map')} />
                <RecentActivityCard onViewAll={() => navigate('/driver/reports')} />
              </div>

              {/* Right column */}
              <div className="lg:col-span-1 flex flex-col gap-6 ml-6">
                <MonthSummaryCard />

                <NearbyStationsCard stations={nearbyStations} onViewAll={() => navigate('/driver/map')} />

                <HelpLinksCard
                  onContact={() => navigate('/driver/support')}
                  onFAQ={() => navigate('/driver/support')}
                  onFeedback={() => navigate('/driver/support')}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Swap Success Dialog */}
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
  );
}

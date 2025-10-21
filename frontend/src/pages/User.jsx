import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useStation } from '../hooks/useContext';
import DashboardHeader from '../components/user/DashboardHeader';
import VehicleStatusCard from '../components/user/VehicleStatusCard';
import RecentActivityCard from '../components/user/RecentActivityCard';
import MonthSummaryCard from '../components/user/MonthSummaryCard';
import NearbyStationsCard from '../components/user/NearbyStationsCard';
import HelpLinksCard from '../components/user/HelpLinksCard';

export default function User() {
  const navigate = useNavigate();
  const { stations } = useStation();

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

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

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background to match Driver.jsx style */}
      <div
        className="absolute inset-0 z-0"
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
        <main className="ml-64 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <DashboardHeader name={headerName} />

            {/* Grid */}
            <div className="flex grid-cols-2 lg:flex-cols-3 gap-6">
              {/* Left column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <VehicleStatusCard onFindStations={() => navigate('/driver/map')} />
                <RecentActivityCard onViewAll={() => navigate('/driver/reports')} />
              </div>

              {/* Right column */}
              <div className="lg:col-span-1 flex flex-col gap-6">
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
    </div>
  );
}

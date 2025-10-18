import WelcomeHeader from './WelcomeHeader'
import VehicleStatus from './VehicleStatus'
import DriverStats from './DriverStats'
import NearbyStations from './NearbyStations'
import RecentActivity from './RecentActivity'
import NeedHelp from './NeedHelp'
import { useAuth } from '../../hooks/useAuth';

export default function DriverDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="max-w-7xl pt-4 mx-auto">
            {/* Main 2-Column Layout */}
            <div className="flex flex-rows-2 mb-6 p-12 lg:grid-cols-2 gap-12">
                {/* Left Column - Welcome Header + Vehicle Status + Recent Activity */}
                <div className="space-y-6">
                    <WelcomeHeader userName={user?.name} />
                    <VehicleStatus />
                    <RecentActivity />
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🚪 Logout
                    </button>
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
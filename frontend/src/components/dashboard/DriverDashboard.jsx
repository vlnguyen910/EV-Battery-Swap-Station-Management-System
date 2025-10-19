import WelcomeHeader from './WelcomeHeader'
import VehicleStatus from './VehicleStatus'
import DriverStats from './DriverStats'
import NearbyStations from './NearbyStations'
import RecentActivity from './RecentActivity'
import NeedHelp from './NeedHelp'
import { useAuth } from '../../hooks/useContext';

export default function DriverDashboard() {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Main 2-Column Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-6 pt-2">
                {/* Left Column - Welcome Header + Vehicle Status + Recent Activity */}
                <div className="space-y-6">
                    <WelcomeHeader userName={user?.name} />
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
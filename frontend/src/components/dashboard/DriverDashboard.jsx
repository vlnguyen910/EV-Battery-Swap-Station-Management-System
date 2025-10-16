import WelcomeHeader from './WelcomeHeader'
import VehicleStatus from './VehicleStatus'
import DriverStats from './DriverStats'
import NearbyStations from './NearbyStations'
import RecentActivity from './RecentActivity'
import NeedHelp from './NeedHelp'

export default function DriverDashboard() {
    return (
        <div className="max-w-7xl pt-4 mx-auto">
            {/* Main 2-Column Layout */}
            <div className="flex flex-rows-2 mb-6 p-12 lg:grid-cols-2 gap-12">
                {/* Left Column - Welcome Header + Vehicle Status + Recent Activity */}
                <div className="space-y-6">
                    <WelcomeHeader userName="Người dùng pro vip" />
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
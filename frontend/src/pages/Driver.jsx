import WelcomeHeader from '../components/dashboard/WelcomeHeader'
import VehicleStatus from '../components/dashboard/VehicleStatus'
import DriverStats from '../components/dashboard/DriverStats'
import NearbyStations from '../components/dashboard/NearbyStations'
import RecentActivity from '../components/dashboard/RecentActivity'
import NeedHelp from '../components/dashboard/NeedHelp'

export default function Driver() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Layout */}
        <div className="grid grid-row-5 lg:grid-cols-2 gap-6">
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
    </div>
  )
}
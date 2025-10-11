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
        {/* Welcome Header - Full Width */}
        <div className="mb-6">
          <WelcomeHeader userName="Alex" />
        </div>
        
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Vehicle Status + Recent Activity */}
          <div className="lg:col-span-6 space-y-6">
            <VehicleStatus />
            <RecentActivity />
          </div>
          
          {/* Middle Column - Nearby Stations */}
          <div className="lg:col-span-3">
            <NearbyStations />
          </div>
          
          {/* Right Column - Driver Stats + Need Help */}
          <div className="lg:col-span-3 space-y-6">
            <DriverStats />
            <NeedHelp />
          </div>
        </div>
      </div>
    </div>
  )
}
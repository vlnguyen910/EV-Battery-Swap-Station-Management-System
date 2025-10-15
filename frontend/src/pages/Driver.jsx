import WelcomeHeader from '../components/dashboard/WelcomeHeader'
import VehicleStatus from '../components/dashboard/VehicleStatus'
import DriverStats from '../components/dashboard/DriverStats'
import NearbyStations from '../components/dashboard/NearbyStations'
import RecentActivity from '../components/dashboard/RecentActivity'
import NeedHelp from '../components/dashboard/NeedHelp'
import Navigation from '../components/layout/Navigation'

export default function Driver() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      {/* Aurora Dream Diagonal Flow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 5% 40%, #6d77ff7a, transparent 67%),
            radial-gradient(ellipse 70% 60% at 45% 45%, #6699ff69, transparent 67%),
            radial-gradient(ellipse 62% 52% at 83% 76%, #a8e8ff70, transparent 63%),
            radial-gradient(ellipse 60% 48% at 75% 20%, #a4bcff5c, transparent 66%),
            linear-gradient(45deg, #eaeeffff 0%, #abbbffff 100%)
          `,
        }}
      />
      
      {/* Content */}
      <div className="min-h-screen relative z-10">
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
      </div>
    </div>
  )
}
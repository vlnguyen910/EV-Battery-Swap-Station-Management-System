// import { Toaster, toast } from 'sonner'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import Sidebar from './components/layout/Sidebar'
import GuestPage from './pages/GuestPage'
import AuthContainer from './components/containers/AuthContainer'
import AdminPage from './pages/AdminPage'
import StaffPage from './pages/StaffPage'
import NotFound from './pages/NotFound'
import MapPage from './pages/Map'
import Driver from './pages/Driver'
import Booking from './pages/Booking'
import SwapHistory from './pages/SwapHistory'
import Plans from './pages/Plans'
import StaffDashboard from './components/dashboard/StaffDashboard'
import StaffInventory from './components/dashboard/StaffInventory'
import StaffInspection from './components/dashboard/StaffInspection'

function App() {
  const location = useLocation()

  // Routes that should show sidebar (authenticated user routes)
  // const sidebarRoutes = ['/driver', '/map', '/plans', '/profile', '/support', '/booking', '/swap-history']
  // const showSidebar = sidebarRoutes.some(route => location.pathname.startsWith(route))

  return (
    <div className="App">
      {/* <Navigation /> */}
      <Routes>
        <Route path="/driver" element={<Driver />} />
        <Route path="/" element={<GuestPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<AuthContainer mode="login" />} />
        <Route path="/register" element={<AuthContainer mode="register" />} />
        <Route path="/admin" element={<AdminPage />} />
        

  <Route path="/map" element={<MapPage />} />
  <Route path="/plans" element={<Plans />} />


        {/* Staff Routes with Nested Routing */}
        <Route path="/staff" element={<StaffPage />}>
          {/* Route con */}
          <Route index element={<StaffDashboard />} />
          <Route path="inventory" element={<StaffInventory />} />
          <Route path="inspection" element={<StaffInspection />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/driver" element={<Driver />}>
          <Route path="booking" element={<Booking />} />
          <Route path="swap-history" element={<SwapHistory />} />
          <Route path="map" element={<MapPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/staff/inventory" element={<StaffInventory />} />
      </Routes>
    </div>
  );
}
export default App;


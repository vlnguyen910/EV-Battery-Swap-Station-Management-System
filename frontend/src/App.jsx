import { Routes, Route } from 'react-router-dom'
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
// import StaffInventory from './components/dashboard/StaffInventory'
import StaffInspection from './components/dashboard/StaffInspection'
import DriverDashboard from './components/dashboard/DriverDashboard'
//import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
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




        {/* Staff Routes with Nested Routing */}
        <Route path="/staff" element={<StaffPage />}>
          {/* Route con   */}
          <Route index element={<StaffDashboard />} />
          {/* <Route path="inventory" element={<StaffInventory />} /> */}
          <Route path="inspection" element={<StaffInspection />} />
        </Route>

        {/* Driver Routes with Nested Routing */}
        <Route path="/driver" element={<Driver />}>
          {/* Route con */}
          <Route index element={<DriverDashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="swap-history" element={<SwapHistory />} />
          <Route path="plans" element={<Plans />} />
          <Route path="map" element={<MapPage />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;


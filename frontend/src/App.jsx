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
import BookingContainer from './components/containers/BookingContainer'
import SwapHistory from './pages/SwapHistory'
import Plans from './pages/Plans'
import Profile from './pages/Profile'
import Support from './pages/Support'
import User from './pages/User'
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
          <Route path="booking" element={<BookingContainer />} />
          <Route path="swap-history" element={<SwapHistory />} />
          <Route path="plans" element={<Plans />} />
          <Route path="map" element={<MapPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;


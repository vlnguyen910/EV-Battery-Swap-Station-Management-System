import { Routes, Route } from 'react-router-dom'
import GuestPage from './pages/GuestPage'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
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
import StaffDashboard from './components/dashboard/StaffDashboard'
import StaffInventory from './components/dashboard/StaffInventory'
import StaffInspection from './components/dashboard/StaffInspection'
import User from './pages/User'
import StaffSwapRequests from './components/swap/StaffSwapRequests'
import ManualSwapTransaction from './components/swap/ManualSwapTransaction'
import Payment from './pages/Payment'
import VerifyEmail from './pages/VerifyEmail'
// import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="App">
      {/* <Navigation /> */}
      <Routes>
        <Route path="/driver" element={<Driver />} />
        <Route path="/" element={<GuestPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/admin" element={<AdminPage />} />


        {/* Staff Routes with Nested Routing */}
        <Route path="/staff" element={<StaffPage />}>
          {/* Route con   */}
          <Route index element={<StaffDashboard />} />
          <Route path="inventory" element={<StaffInventory />} />
          <Route path="inspection" element={<StaffInspection />} />
          <Route path="swap-requests" element={<StaffSwapRequests />} />
          <Route path="manual-swap" element={<ManualSwapTransaction />} />
        </Route>

        {/* Payment Routes (outside Driver layout for clean UI) */}


        {/* Driver Routes with Nested Routing */}
        <Route path="/driver" element={<Driver />}>
          {/* Route con */}
          <Route index element={<User />} />
          <Route path="booking" element={<BookingContainer />} />
          <Route path="booking/:stationId" element={<BookingContainer />} />
          <Route path="swap-history" element={<SwapHistory />} />
          <Route path="plans" element={<Plans />} />
          <Route path="map" element={<MapPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
          <Route path="payment/success" element={<Payment />} />
          <Route path="payment/failure" element={<Payment />} />
          <Route path="payment/error" element={<Payment />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;


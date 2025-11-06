import { Routes, Route } from 'react-router-dom'
import GuestPage from './pages/GuestPage'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import GoogleCallback from './components/auth/GoogleCallback'
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
import ResetPassword from './pages/ResetPassword'
import ForgetPassword from './pages/ForgetPassword'
// import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="App">
      {/* <Navigation /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GuestPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        {/* Driver Routes with Nested Routing */}
        <Route path="/driver" element={<Driver />}>
          {/* Route container for User */}
          <Route index element={<User />} />
          <Route path="booking" element={<BookingContainer />} />
          <Route path="booking/:stationId" element={<BookingContainer />} />
          <Route path="swap-history" element={<SwapHistory />} />
          <Route path="plans" element={<Plans />} />
          <Route path="map" element={<MapPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
          {/* Payment Routes*/}
          <Route path="payment/success" element={<Payment />} />
          <Route path="payment/failed" element={<Payment />} />
          <Route path="payment/error" element={<Payment />} />
        </Route>

        {/* Staff Routes with Nested Routing */}
        <Route path="/staff" element={<StaffPage />}>
          {/* Route container for Staff */}
          <Route index element={<StaffDashboard />} />
          <Route path="inventory" element={<StaffInventory />} />
          <Route path="inspection" element={<StaffInspection />} />
          <Route path="swap-requests" element={<StaffSwapRequests />} />
          <Route path="manual-swap" element={<ManualSwapTransaction />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />}>
          {/* Add nested routes for Admin here */}
        </Route>

        {/* 404 Not Found - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
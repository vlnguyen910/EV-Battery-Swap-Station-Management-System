// import { Toaster, toast } from 'sonner'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import Driver from './pages/Driver'
import GuestPage from './pages/GuestPage'
import AuthContainer from './components/containers/AuthContainer'
import AdminPage from './pages/AdminPage'
import StaffPage from './pages/StaffPage'
import NotFound from './pages/NotFound'
import StaffDashboard from './components/dashboard/StaffDashboard'
import StaffInventory from './components/dashboard/StaffInventory'
import StaffInspection from './components/dashboard/StaffInspection'
//import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="App">
      {/* <Navigation /> */}
      <Routes>
        {/* <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={["driver", "admin", "station_staff"]}>
              <Driver />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/driver" element={<Driver />} />
        <Route path="/" element={<GuestPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<AuthContainer mode="login" />} />
        <Route path="/register" element={<AuthContainer mode="register" />} />
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/admin" element={<AdminPage />} />

        {/* <Route
          path='/staff'
          element={
            <ProtectedRoute allowedRoles={["station_staff"]}>
              <StaffPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="inventory" element={<StaffInventory />} />
          <Route path="inspection" element={<StaffInspection />} />
        </Route> */}

        <Route path="/staff" element={<StaffPage />}>
          {/* Route con   */}
          <Route index element={<StaffDashboard />} />
          <Route path="inventory" element={<StaffInventory />} />
          <Route path="inspection" element={<StaffInspection />} />
        </Route>

      </Routes>
    </div>
  );
}
export default App;


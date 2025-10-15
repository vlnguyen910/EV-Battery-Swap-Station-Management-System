// import { Toaster, toast } from 'sonner'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import Sidebar from './components/layout/Sidebar'
import GuestPage from './pages/GuestPage'
import AuthContainer from './components/containers/AuthContainer'
import AdminPage from './pages/AdminPage'
import StaffPage from './pages/StaffPage'
import UserPage from './pages/UserPage'
import NotFound from './pages/NotFound'
import MapPage from './pages/Map'
import Driver from './pages/Driver'
import Booking from './pages/Booking'
import SwapHistory from './pages/SwapHistory'

function App() {
  const location = useLocation()
  
  // Routes that should show sidebar (authenticated user routes)
  const sidebarRoutes = ['/driver', '/map', '/plans', '/profile', '/support', '/booking', '/swap-history']
  const showSidebar = sidebarRoutes.some(route => location.pathname.startsWith(route))
  
  return (
    <div className="App">
      {/* Show Sidebar for authenticated routes */}
      {showSidebar && <Sidebar />}
      
      {/* Main Content Area */}
      <div className={`${showSidebar ? 'ml-64' : ''} overflow-x-hidden min-h-screen`}>
        {/* Show Navigation for guest routes */}
        {!showSidebar && <Navigation />}
        
        <Routes>
          <Route path="/driver" element={<Driver />} />
          <Route path="/" element={<GuestPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<AuthContainer mode="login" />} />
          <Route path="/register" element={<AuthContainer mode="register" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/swap-history" element={<SwapHistory />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;


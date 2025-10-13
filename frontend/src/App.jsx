// import { Toaster, toast } from 'sonner'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import GuestPage from './pages/GuestPage'
import AuthContainer from './components/containers/AuthContainer'
import AdminPage from './pages/AdminPage'
import StaffPage from './pages/StaffPage'
import UserPage from './pages/UserPage'
import NotFound from './pages/NotFound'
import Driver from './pages/Driver'

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
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </div>
  );
}
export default App;


import { Routes, Route } from 'react-router-dom';
import GuestPage from '../pages/GuestPage';
import LoginPage from '../components/auth/Login';
import Register from '../components/auth/Register';
import AdminPage from '../pages/AdminPage';
import StaffPage from '../pages/StaffPage';
import UserPage from '../pages/UserPage';
import NotFound from '../pages/NotFound';
import Driver from '../pages/Driver';
import Navigation from '../components/layout/Navigation';

export default function AppRoutes() {
  return (
    <Routes>
    <Route path="/" element={<GuestPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/user" element={<UserPage />} />
      {/* Routes for Driver (de test) */}
      <Route path="/driver" element={<Driver />} />
    </Routes>
  );
}
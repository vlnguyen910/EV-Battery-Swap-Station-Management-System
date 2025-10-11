import { Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import GuestPage from './components/GuestPage'
import LoginPage from './components/auth/Login'
import Register from './components/auth/Register'
import AdminPage from './components/admin/AdminPage'
import StaffPage from './components/staff/StaffPage'
import UserPage from './components/user/UserPage'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<GuestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
export default App;
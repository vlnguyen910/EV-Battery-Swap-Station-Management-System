import { Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import GuestPage from './pages/GuestPage'
import LoginPage from './components/auth/Login'
import Register from './components/auth/Register'
import AdminPage from './pages/AdminPage'
import StaffPage from './pages/StaffPage'
import UserPage from './pages/UserPage'

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </div>
  );
}
export default App;
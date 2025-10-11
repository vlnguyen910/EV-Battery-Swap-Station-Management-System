// import { Toaster, toast } from 'sonner'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import GuestPage from './pages/GuestPage'
import AuthContainer from './components/containers/AuthContainer'
import AdminPage from './pages/AdminPage'
import StaffPage from './pages/StaffPage'
import UserPage from './pages/UserPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<GuestPage />} />
        <Route path="*" element={<NotFound />} />
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


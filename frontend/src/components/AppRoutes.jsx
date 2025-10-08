import { Routes, Route } from 'react-router-dom'
import Home from './common/Map'
import Dashboard from '../pages/Dashboard'
import Stations from '../pages/Stations'
import Batteries from '../pages/Batteries'
import Users from '../pages/Users'
import Reports from '../pages/Reports'

// Component quản lý tất cả các routes của ứng dụng
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stations" element={<Stations />} />
      <Route path="/batteries" element={<Batteries />} />
      <Route path="/users" element={<Users />} />
      <Route path="/reports" element={<Reports />} /> */}
    </Routes>
  )
}
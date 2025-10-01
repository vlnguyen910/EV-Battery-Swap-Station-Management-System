import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Stations from './pages/Stations'
import Batteries from './pages/Batteries'
import Users from './pages/Users'
import Reports from './pages/Reports'

function App() {
  return (
    <>
      <Navigation />
      <div>
        <h1>EV Battery Swap Station Management System</h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/batteries" element={<Batteries />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
      <img src="logo.png" alt="Background" style={{ position: 'fixed', bottom: 0, right: 0, width: '200px', height: '200px', opacity: 0.5 }} />
    </>
  )
}

export default App

import { Toaster, toast } from 'sonner'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import NotFound from './pages/NotFound'
import HomePage from './pages/HomePage'
import Navigation from './components/layout/Navigation'
import AppRoutes from './components/AppRoutes'


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
import Home from './components/common/Map'

export default App

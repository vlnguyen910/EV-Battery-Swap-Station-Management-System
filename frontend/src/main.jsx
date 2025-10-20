import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { StationProvider } from './contexts/StationContext.jsx';
import { BatteryProvider } from './contexts/BatteryContext.jsx';
// import { SwapProvider } from './contexts/SwapContext.jsx';
import { ReservationProvider } from './contexts/ReservationContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StationProvider>
          <BatteryProvider>
            <ReservationProvider>
              {/* <SwapProvider> */}
              <App />
              {/* </SwapProvider> */}
            </ReservationProvider>
          </BatteryProvider>
        </StationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

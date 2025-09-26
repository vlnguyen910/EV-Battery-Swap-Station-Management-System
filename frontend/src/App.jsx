import { useState } from 'react'
import Navigation from './components/layout/Navigation'

function App() {
  return (
    <>
      <Navigation />
      <div>
        <img src="/logo.png" alt="EV Battery Swap Station Management System" className="logo" />
        <h1>EV Battery Swap Station Management System</h1>
      </div>
    </>
  )
}

export default App

import { Outlet } from 'react-router-dom'
import Navigation from '../components/layout/Navigation'

export default function Driver() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      {/* Aurora Dream Diagonal Flow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 5% 40%, #6d77ff7a, transparent 67%),
            radial-gradient(ellipse 70% 60% at 45% 45%, #6699ff69, transparent 67%),
            radial-gradient(ellipse 62% 52% at 83% 76%, #a8e8ff70, transparent 63%),
            radial-gradient(ellipse 60% 48% at 75% 20%, #a4bcff5c, transparent 66%),
            linear-gradient(45deg, #eaeeffff 0%, #abbbffff 100%)
          `,
        }}
      />

      {/* Navigation */}
      <Navigation type="main" />

      {/* Content */}
      <div className="min-h-screen relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Trang con sẽ render ở đây */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
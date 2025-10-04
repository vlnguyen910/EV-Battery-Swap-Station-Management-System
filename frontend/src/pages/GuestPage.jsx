import { useNavigate } from 'react-router-dom'

export default function GuestPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔋</div>
        <h1>EV Battery Swap Station</h1>
        <h2>Welcome, Guest!</h2>

        <p>🚗 Manage your electric vehicle battery swapping</p>

        <p>Please log in to access the management system</p>

        <button
          onClick={() => navigate('/login')}
        >
          🚀 Login to System
        </button>
        <br />
        <br />
        <button
          onClick={() => navigate('/register')}
        >
          🚀 Register to System
        </button>

      </div>
    </div>
  )
}

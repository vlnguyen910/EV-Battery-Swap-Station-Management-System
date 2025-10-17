// src/components/admin/CreateStaffForm.jsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function CreateStaffForm() {
  const { createStaffAccount, logout } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    role: 'station_staff'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await createStaffAccount(formData)
      setMessage(`✅ Tạo tài khoản thành công cho ${response.username || formData.username}`)
      setFormData({
        username: '',
        password: '',
        phone: '',
        email: '',
        role: 'station_staff'
      })
    } catch (err) {
      // Log full error for debugging
      console.error('Create staff failed (frontend catch):', err)

      // Try to extract validation messages from our client/server error shape
      let userMessage = '❌ Không thể tạo tài khoản. Có thể bạn không có quyền hoặc dữ liệu bị trùng.'
      if (err?.details) {
        // our authService attaches validation details to err.details
        if (Array.isArray(err.details)) {
          userMessage = '❌ ' + err.details.join('; ')
        } else if (err.details.message) {
          userMessage = '❌ ' + (Array.isArray(err.details.message) ? err.details.message.join('; ') : err.details.message)
        }
      } else if (err?.response?.data) {
        const data = err.response.data
        if (data.message) {
          userMessage = '❌ ' + (Array.isArray(data.message) ? data.message.join('; ') : data.message)
        }
      }

      setMessage(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white border rounded-lg shadow-md max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-800">Tạo tài khoản nhân viên trạm</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
        >
          {loading ? 'Đang tạo...' : '➕ Tạo tài khoản'}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {message}
          </p>
        )}
      </form>
      <button
        onClick={logout}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🚪 Logout
      </button>
    </div>
  )
}






// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// export default function AdminPage() {
//   const { user, logout, createStaffAccount } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate('/', { replace: true });
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#f8f9fa',
//       padding: '2rem'
//     }}>
//       {/* Dashboard for creating account for staff */}
//       <h2 style={{ color: '#333', margin: '0 0 1rem 0' }}>👥 Staff Management</h2>
//       <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Create and manage staff accounts.</p>
//       <button style={{
//         padding: '0.5rem 1rem',
//         backgroundColor: '#007bff',
//         color: 'white',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer'
//       }} onClick={async () => {
//         const staffInfo = {
//           name: 'New Staff',
//           email: 'staff@example.com',
//           password: 'password123',
//           role: 'staff'
//         };
//         await createStaffAccount(staffInfo);
//       }}>
//         ➕ Create Staff Account
//       </button>

//       <div style={{
//         maxWidth: '1200px',
//         margin: '0 auto',
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//         padding: '2rem'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '2rem',
//           borderBottom: '1px solid #dee2e6',
//           paddingBottom: '1rem'
//         }}>
//           <div>
//             <h1 style={{ color: '#333', margin: 0 }}>👑 Admin Dashboard</h1>
//             <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Welcome back, {user?.name}!</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             style={{
//               padding: '0.5rem 1rem',
//               backgroundColor: '#dc3545',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             🚪 Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
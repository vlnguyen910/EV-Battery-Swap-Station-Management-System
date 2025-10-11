import { useState } from "react";

export default function Register({ onSubmit, loading, error, success }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'driver'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
      return; // Container sẽ handle validation error
    }

    // Gọi onSubmit từ container (AuthContainer)
    onSubmit(formData);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Đăng Ký Tài Khoản</h2>

      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px',
          border: '1px solid #f44336'
        }}>
          {String(error)}
        </div>
      )}

      {success && (
        <div style={{
          color: 'green',
          backgroundColor: '#e8f5e8',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px',
          border: '1px solid #4caf50'
        }}>
          {String(success)}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">User Name:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading || success ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || success ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Đang đăng ký...' : success ? 'Đăng ký thành công!' : 'Đăng ký'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
      </p>
    </div>
  );
}
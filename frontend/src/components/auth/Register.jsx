import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'driver'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const userData = await register(formData);
      console.log('Registered user:', userData);

      // Hiển thị thông báo thành công
      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');

      // Chuyển về trang login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration failed:', error);

      // Kiểm tra xem có phải user đã tồn tại
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';

      if (errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate') ||
        error.response?.status === 409) {
        setError('Tài khoản đã tồn tại. Vui lòng thử email hoặc số điện thoại khác.');
      } else if (error.response?.status === 500) {
        // Có thể đăng ký thành công nhưng lỗi response
        setSuccess('Đăng ký có thể đã thành công. Vui lòng thử đăng nhập.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
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
          {error}
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
          {success}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Tên đăng nhập:</label>
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
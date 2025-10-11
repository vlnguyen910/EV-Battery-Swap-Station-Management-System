import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'station_staff':
          navigate('/staff', { replace: true });
          break;
        case 'driver':
          navigate('/user', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.emailOrPhone || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Gọi login function từ AuthContext
      const userData = await login({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password
      });

      console.log('Login successful:', userData);
      // Redirect sẽ được handle bởi useEffect khi isAuthenticated thay đổi

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" >
      <div className="login-form" >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Login to Your Account
        </h2>

        {error && (
          <div className="error-message" style={{
            color: '#dc3545',
            marginBottom: '1rem',
            padding: '0.75rem',
            border: '1px solid #dc3545',
            borderRadius: '4px',
            backgroundColor: '#f8d7da'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="emailOrPhone" >
              Email or Phone:
            </label>
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              placeholder="Enter your email or phone"
              disabled={loading || authLoading}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={loading || authLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
          >
            {(loading || authLoading) ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>

        <div className="login-footer" style={{
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              disabled={loading || authLoading}
            >
              Sign up here
            </button>
          </p>
          <button
            onClick={() => navigate('/')}
            disabled={loading || authLoading}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
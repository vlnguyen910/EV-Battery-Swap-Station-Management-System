import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.emailOrPhone || !formData.password) {
      return; // Container sẽ handle validation error
    }

    // Gọi onSubmit từ container (AuthContainer)
    onSubmit({
      emailOrPhone: formData.emailOrPhone,
      password: formData.password
    });
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
            {String(error)}
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
              disabled={loading}
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
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center px-4 py-2 rounded-md text-white 
    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              '🚀 Login'
            )}
          </button>

        </form>

        <div className="login-footer" style={{
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <p>
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button disabled={loading}>
                Sign up here
              </button>
            </Link>
          </p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button disabled={loading}>
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
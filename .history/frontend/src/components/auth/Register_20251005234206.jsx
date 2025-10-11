import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Về trang chủ</span>
      </button>

      {/* Left Side - Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Đăng Ký Tài Khoản
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Tham gia hệ thống đổi pin thông minh
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="0123456789"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${loading || success
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 active:scale-95'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang đăng ký...
                  </div>
                ) : success ? (
                  'Đăng ký thành công!'
                ) : (
                  'Đăng ký tài khoản'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Battery Exchange Animation */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="relative">
          {/* Battery Cabinet */}
          <div className={`relative transition-all duration-1000 ${success ? 'animate-bounce' : error ? 'animate-pulse' : ''
            }`}>
            {/* Cabinet Body */}
            <div className="w-64 h-80 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg shadow-2xl border-4 border-gray-600">
              {/* Cabinet Screen */}
              <div className="w-full h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">EV BATTERY</span>
              </div>

              {/* Battery Slots */}
              <div className="grid grid-cols-2 gap-4 p-4">
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className={`relative transition-all duration-500`}>
                    {/* Battery Slot */}
                    <div className={`w-20 h-24 rounded-lg border-2 flex items-center justify-center ${success ? 'border-green-400 bg-green-100' : 'border-gray-400 bg-white'
                      }`}>
                      {/* Battery Icon */}
                      <div className={`w-12 h-16 rounded transition-all duration-700 ${success ? 'bg-gradient-to-b from-green-400 to-green-600 animate-pulse' : 'bg-gradient-to-b from-gray-300 to-gray-400'
                        }`}>
                        <div className="w-4 h-2 bg-gray-600 mx-auto rounded-t"></div>
                        <div className="flex items-center justify-center h-full">
                          <div className={`text-xs font-bold ${success ? 'text-white' : 'text-gray-600'
                            }`}>⚡</div>
                        </div>
                      </div>
                    </div>

                    {/* Battery Flying Animation */}
                    {success && slot === 1 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-8 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded">
                          <div className="w-2 h-1 bg-gray-600 mx-auto rounded-t"></div>
                          <div className="flex items-center justify-center h-full text-white text-xs">⚡</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Cabinet Door */}
              <div className={`absolute top-16 left-0 w-full h-60 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-lg border-l-4 border-r-4 border-b-4 border-gray-600 transition-all duration-1000 transform origin-left ${success ? 'rotate-y-90 opacity-50' : error ? 'animate-shake' : ''
                }`}>
                <div className="w-6 h-6 bg-gray-800 rounded-full absolute right-4 top-1/2 transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* Person Character */}
          <div className={`absolute -right-24 top-1/2 transform -translate-y-1/2 transition-all duration-1000 ${loading ? 'animate-bounce' : success ? 'scale-110' : error ? 'opacity-70' : ''
            }`}>
            {/* Person Body */}
            <div className="relative">
              {/* Head */}
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 ${success ? 'bg-gradient-to-b from-yellow-300 to-yellow-400' : error ? 'bg-gradient-to-b from-gray-400 to-gray-500' : 'bg-gradient-to-b from-yellow-200 to-yellow-300'
                }`}>
                {/* Face */}
                <div className="flex items-center justify-center h-full text-lg">
                  {success ? '😊' : error ? '😞' : loading ? '🤔' : '😐'}
                </div>
              </div>

              {/* Body */}
              <div className={`w-8 h-16 mx-auto rounded-t-full ${success ? 'bg-gradient-to-b from-blue-400 to-blue-600' : 'bg-gradient-to-b from-blue-300 to-blue-500'
                }`}></div>

              {/* Arms */}
              <div className={`absolute top-14 -left-2 w-6 h-2 rounded-full transform transition-all duration-500 ${success ? 'bg-yellow-300 rotate-45' : 'bg-yellow-200 rotate-12'
                }`}></div>
              <div className={`absolute top-14 -right-2 w-6 h-2 rounded-full transform transition-all duration-500 ${success ? 'bg-yellow-300 -rotate-45' : 'bg-yellow-200 -rotate-12'
                }`}></div>

              {/* Legs */}
              <div className="flex gap-1 justify-center mt-1">
                <div className="w-2 h-8 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-8 bg-gray-600 rounded-full"></div>
              </div>

              {/* Battery in Hand (when successful) */}
              {success && (
                <div className="absolute -top-4 right-0 w-6 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded animate-pulse">
                  <div className="w-2 h-1 bg-gray-600 mx-auto rounded-t"></div>
                  <div className="flex items-center justify-center h-full text-white text-xs">⚡</div>
                </div>
              )}
            </div>
          </div>

          {/* Status Text */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <p className={`font-semibold text-lg transition-all duration-300 ${success ? 'text-green-600' : error ? 'text-red-600' : loading ? 'text-blue-600' : 'text-gray-600'
              }`}>
              {success ? '🎉 Đăng ký thành công!' : error ? '❌ Đăng ký thất bại' : loading ? '⏳ Đang xử lý...' : '🔋 Sẵn sàng đăng ký'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {success ? 'Pin đã được cấp phát!' : error ? 'Vui lòng thử lại' : loading ? 'Vui lòng chờ...' : 'Điền thông tin để nhận pin'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useContext";
import { useState, useEffect } from "react";
import Navigation from "../layout/Navigation";

const registerSchema = z
  .object({
    username: z.string().nonempty("Tên đăng nhập không được để trống").min(3, "Tên đăng nhập ít nhất 3 ký tự"),
    email: z
      .string()
      .nonempty("Email không được để trống")
      .refine((value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }, {
        message: "Hãy nhập email hợp lệ",
      }),
    phone: z
      .string()
      .nonempty("Số điện thoại không được để trống")
      .min(10, "Số điện thoại không hợp lệ")
      .refine((value) => {
        const phoneRegex = /^0(3|5|7|8|9)\d{8}$/;
        return phoneRegex.test(value);
      }, {
        message: "Hãy nhập số điện thoại hợp lệ",
      }),
    password: z.string().nonempty("Vui lòng nhập mật khẩu").min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function Register() {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Clear error khi component mount
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [clearError]);

  const handleRegister = async (data) => {
    clearError();
    setLocalError(null);
    setSuccess(false);

    try {
      // Remove confirmPassword trước khi gửi
      const { confirmPassword, ...registerData } = data;
      const res = await registerUser(registerData);
      if (res) {
        setSuccess(true);
      }
    } catch (err) {
      // Errors are set in AuthContext (error state). Mirror it locally if needed.
      const errorMessage = err?.message || error || "Đăng ký không thành công. Vui lòng thử lại.";
      setLocalError(errorMessage);
    }
  };

  // Hiển thị error từ context hoặc local error
  const displayError = localError || error;

  return (
    <div>
      <Navigation />
      <div className="relative min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover blur-md scale-105"
          style={{ backgroundImage: "url('/images/login_register_bg.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>

        <div className="relative max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Human Power
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Tạo tài khoản mới để bắt đầu
            </p>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User name</label>
              <input
                {...register("username")}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Tên đăng nhập"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                {...register("email")}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input
                {...register("phone")}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Số điện thoại"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                {...register("password")}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Mật khẩu"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                {...register("confirmPassword")}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Đăng ký thành công! Đang chuyển đến trang đăng nhập...
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${loading || success
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang đăng ký...
                </span>
              ) : success ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Đăng ký thành công!
                </span>
              ) : (
                "📝 Đăng ký"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
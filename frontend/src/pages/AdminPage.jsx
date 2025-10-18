import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthHandler } from "../hooks/useAuthHandler";

const registerSchema = z.object({
  // Ensure fields are not empty explicitly
  // add nonempty for clearer messages when a field is left blank
  username: z.string().nonempty("Tên đăng nhập không được để trống").min(3, "Tên đăng nhập ít nhất 3 ký tự"),
  password: z.string().nonempty("Vui lòng nhập mật khẩu").min(6, "Mật khẩu ít nhất 6 ký tự"),
  phone: z
    .string()
    .nonempty("Số điện thoại không được để trống")
    // Vietnam mobile numbers: 10 digits, start with 03|05|07|08|09 (01x series were migrated and are no longer valid)
    .regex(/^0(3|5|7|8|9)\d{8}$/, "Số điện thoại không hợp lệ"),
  email: z.string().nonempty("Email không được để trống").email("Email không hợp lệ"),
  role: z.enum(["station_staff", "admin"]).refine((v) => !!v, {
    message: 'Role là bắt buộc',
  }),
});

export default function CreateStaffForm({ onSubmit, loading, error, success }) {
  // Parent (AuthContainer) may pass `onSubmit` to handle create logic.
  // If not provided (this component used as a standalone page), fall back to calling createStaffAccount directly.
  const { logout, createStaffAccount } = useAuthHandler();
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      email: "",
      role: "station_staff",
    },
  });

  const handleFormSubmit = async (data) => {
    setMessage("");
    try {
      // Prefer parent-provided handler (AuthContainer).
      // If absent, fall back to local createStaffAccount.
      const res = onSubmit ? await onSubmit(data) : await createStaffAccount(data);

      // If server returns created user with username, show it. Otherwise show a generic success.
      if (res && res.username) setMessage(`✅ Tạo tài khoản thành công cho ${res.username}`);
      else setMessage('✅ Yêu cầu tạo tài khoản đã được gửi');

      reset();
    } catch (err) {
      const msg = err?.details?.join?.('; ') || err?.response?.message || 'Không thể tạo tài khoản. Có thể dữ liệu bị trùng hoặc bạn không có quyền.';
      setMessage(`❌ ${msg}`);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-6 bg-white border rounded-lg shadow-md max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-800">
          Tạo tài khoản nhân viên trạm
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên đăng nhập
          </label>
          <input
            {...register("username")}
            placeholder="Tên đăng nhập"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Mật khẩu"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            {...register("phone")}
            placeholder="Số điện thoại"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
        >
          {loading ? "Đang tạo..." : "➕ Tạo tài khoản"}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
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
  );
}

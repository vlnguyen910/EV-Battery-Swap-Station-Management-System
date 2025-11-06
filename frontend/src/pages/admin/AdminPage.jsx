import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useContext";

const registerSchema = z.object({
  username: z.string().nonempty("Username is required").min(3, "Username must be at least 3 characters"),
  password: z.string().nonempty("Please enter a password").min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^0(3|5|7|8|9)\d{8}$/, "Invalid phone number"),
  email: z.string().nonempty("Email is required").email("Invalid email"),
  role: z.enum(["station_staff", "admin"]).refine((v) => !!v, {
    message: 'Role is required',
  }),
});

export default function AdminPage() {
  const { createStaffAccount, logout, loading, error, clearError } = useAuth();
  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState(null);

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

  // Clear error on mount
  useEffect(() => {
    clearError();
    setMessage("");
    setLocalError(null);
  }, [clearError]);

  const handleFormSubmit = async (data) => {
    setMessage("");
    setLocalError(null);
    clearError();

    try {
      const res = await createStaffAccount(data);

      // Success message
      if (res && res.username) {
        setMessage(`✅ Account created for ${res.username}`);
      } else if (res && res.data && res.data.username) {
        setMessage(`✅ Account created for ${res.data.username}`);
      } else {
        setMessage('✅ Account creation request submitted');
      }

      reset();
    } catch (err) {
      console.error("Create staff error:", err);

  // Format error message
  let errorMsg = "Unable to create account. Data may be duplicated or you may not have permission.";

      if (err?.message) {
        errorMsg = err.message;
      } else if (err?.details) {
        errorMsg = Array.isArray(err.details) ? err.details.join('; ') : err.details;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.response?.message) {
        errorMsg = err.response.message;
      }

      setMessage(`❌ ${errorMsg}`);
      setLocalError(errorMsg);
    }
  };

  // Display error from context or local error
  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition"
            >
              🚪 Logout
            </button>
          </div>

          <div className="border-t pt-6">
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Create Station Staff Account
              </h2>

              {/* Error Message Box */}
              {displayError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{displayError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  {...register("username")}
                  placeholder="Username"
                  disabled={loading}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Password"
                  disabled={loading}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <input
                  {...register("phone")}
                  placeholder="Phone number"
                  disabled={loading}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={loading}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register("role")}
                  disabled={loading}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="station_staff">Station Staff</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Creating...
                  </span>
                ) : (
                  "➕ Create Account"
                )}
              </button>

              {/* Success/Error Message */}
              {message && (
                <div
                  className={`p-4 rounded-lg border ${message.startsWith("✅")
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                    }`}
                >
                  <p className="text-sm">{message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useAuth } from "./useContext";
import useAsyncHandler from "./useAsyncHandler";
import { useNavigate } from "react-router-dom";

export function useAuthHandler() {
  const { createStaffAccount, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const { run: runLogin, loading: loginLoading } = useAsyncHandler(
    async (credentials) => {
      const user = await login(credentials);
      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "station_staff") navigate("/staff");
      else navigate("/driver");
      return user;
    },
    { onError: (e) => console.error("Login error:", e) }
  );

  const { run: runRegister, loading: registerLoading } = useAsyncHandler(
    async (payload) => {
      const res = await register(payload);
      setTimeout(() => navigate("/login"), 1000);
      return res;
    },
    { onError: (e) => console.error("Register error:", e) }
  );

  const { run: runCreateStaff, loading: createLoading } = useAsyncHandler(
    async (data) => {
      return await createStaffAccount(data);
    },
    { onError: (e) => console.error("Create staff error:", e) }
  );

  return {
    login: runLogin,
    register: runRegister,
    createStaffAccount: runCreateStaff,
    logout,
    loading: loginLoading || registerLoading || createLoading,
  };
}

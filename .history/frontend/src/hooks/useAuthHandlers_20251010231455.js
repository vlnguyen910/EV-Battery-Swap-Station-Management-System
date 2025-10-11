import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import useAsyncHandler from "./useAsyncHandler";

export function useLoginHandler() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { run, loading, error, success } = useAsyncHandler(
    async (credentials) => {
      const user = await login(credentials);

      // Role-based redirect
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "station_staff") {
        navigate("/staff");
      } else {
        navigate("/user");
      }

      return user;
    },
    {
      onError: (e) => console.error("Login error:", e),
      onSuccess: (user) => console.log("Login successful:", user),
    }
  );

  return { run, loading, error, success };
}

export function useRegisterHandler() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { run, loading, error, success } = useAsyncHandler(
    async (payload) => {
      const res = await register(payload);

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1200);

      return res;
    },
    {
      onError: (e) => console.error("Register error:", e),
      onSuccess: (res) => console.log("Register successful:", res),
    }
  );

  return { run, loading, error, success };
}

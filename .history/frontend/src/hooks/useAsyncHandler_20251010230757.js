import { useState, useCallback, useNavigate } from "react";
import { useAuth } from "./useAuth";

// Custom hook to handle async operations with loading, error, and success states

export function useAsyncHandler(fn, { onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await fn(...args);
        setSuccess(res);
        onSuccess?.(res);
        return res;
      } catch (err) {
        setError(err);
        onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },

    [fn, onSuccess, onError]
  );

  return { run, loading, error, success, setError, setSuccess };
}

export function useLoginHandler() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useAsyncHandler(
    async (credentials) => {
      const user = await login(credentials);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "station_staff") navigate("/staff");
      else navigate("/user");
      return user;
    },
    { onError: (e) => console.error("Login error:", e) }
  );
}

export function useRegisterHandler() {
  const { register } = useAuth();
  const navigate = useNavigate();

  return useAsyncHandler(async (payload) => {
    const res = await register(payload);
    setTimeout(() => navigate("/login"), 1200);
    return res;
  });
}

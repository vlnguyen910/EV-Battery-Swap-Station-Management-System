import { useState, useCallback } from "react";

// Custom hook to handle async operations with loading, error, and success states
export default function useAsyncHandler(fn, { onSuccess, onError } = {}) {
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
        // Don't throw error to prevent uncaught promise rejection
        console.error('useAsyncHandler error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },

    [fn, onSuccess, onError]
  );

  return { run, loading, error, success, setError, setSuccess };
}

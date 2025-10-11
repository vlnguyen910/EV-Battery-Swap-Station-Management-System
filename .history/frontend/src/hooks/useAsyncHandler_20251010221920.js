import { useState, useCallback } from "react";

export default function useAsyncHandler(fn, { onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fn(...args);
      setSuccess(res);
    } catch (error) {}
  });

  return <div>useAsyncHandler</div>;
}

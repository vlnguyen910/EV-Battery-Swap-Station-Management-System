import { useState, useCallback } from "react";

export default function useAsyncHandler() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  return <div>useAsyncHandler</div>;
}

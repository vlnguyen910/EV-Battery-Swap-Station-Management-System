// hooks/useApi.js
import { useAuth } from "./useAuth";
import api from "../services/api";

export const useApi = () => {
  const { token } = useAuth();

  // Hàm gọi API có token sẵn
  const callApi = async (method, url, data = null) => {
    try {
      const response = await api({
        method,
        url,
        data,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      return response.data;
    } catch (err) {
      console.error("API call error:", err);
      throw err;
    }
  };

  return { callApi };
};

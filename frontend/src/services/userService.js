import api from "./api";

const userService = {
  async getUserByEmail(email) {
    const response = await api.get(`/users/email/${encodeURIComponent(email)}`);
    return response.data;
  },

  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

export default userService;

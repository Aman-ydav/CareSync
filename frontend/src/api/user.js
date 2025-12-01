import api from "./axiosInterceptor";

export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  // Verify email
  verifyEmail: async (verificationData) => {
    const response = await api.post("/users/verify-email", verificationData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(`/users/reset-password/${token}`, { password });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post("/users/refresh-token");
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/users/logout");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};
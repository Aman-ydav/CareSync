import api from "./axiosInterceptor";

export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  // Get all users with filters
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get all appointments (admin view)
  getAllAppointments: async (params = {}) => {
    const response = await api.get("/admin/appointments", { params });
    return response.data;
  },

  // Get all health records (admin view)
  getAllHealthRecords: async (params = {}) => {
    const response = await api.get("/admin/health-records", { params });
    return response.data;
  },

  // Get system analytics
  getAnalytics: async (period = "monthly") => {
    const response = await api.get(`/admin/analytics/${period}`);
    return response.data;
  },

  // Update system settings
  updateSettings: async (settings) => {
    const response = await api.put("/admin/settings", settings);
    return response.data;
  },
};
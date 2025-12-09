import api from "./axiosInterceptor";

export const authAPI = {

  login: async (credentials) => {
    const res = await api.post("/users/login", credentials, { withCredentials: true });
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post("/users/register", userData, { withCredentials: true });
    return res.data;
  },

  verifyEmail: async (data) => {
    const res = await api.post("/users/verify-email", data);
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post("/users/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (token, password) => {
    const res = await api.post(`/users/reset-password/${token}`, { password });
    return res.data;
  },

  refreshToken: async () => {
    const res = await api.post("/users/refresh-token");
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/users/logout");
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get("/users/current-user", { withCredentials: true });
    return res.data;
  },

  // >>> NEW API <<<

  getDoctors: async () => {
    const res = await api.get("/users/doctors");
    return res.data.data;
  },

  getDoctor: async (id) => {
    const res = await api.get(`/users/doctor/${id}`);
    return res.data.data;
  },

  getPatients: async () => {
    const res = await api.get("/users/patients");
    return res.data.data;
  },

  getPatient: async (id) => {
    const res = await api.get(`/users/patient/${id}`);
    return res.data.data;
  },

  getAllUsers: async () => {
    const res = await api.get("/users/all");
    return res.data.data;
  },
};

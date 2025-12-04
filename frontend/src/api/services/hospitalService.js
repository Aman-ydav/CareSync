// src/api/services/hospitalService.js
import api from "../axiosInterceptor";

export const hospitalService = {
  // GET all hospitals with filters
  getHospitals: async (params = {}) => {
    const res = await api.get("/hospitals", { params });
    return res.data.data; // { hospitals, pagination }
  },

  // GET by ID
  getHospitalById: async (id) => {
    const res = await api.get(`/hospitals/${id}`);
    return res.data.data; // hospital object
  },

  // CREATE hospital (Admin only)
  createHospital: async (payload) => {
    const res = await api.post("/hospitals", payload);
    return res.data.data; // created hospital
  },

  // UPDATE hospital
  updateHospital: async (id, payload) => {
    const res = await api.patch(`/hospitals/${id}`, payload);
    return res.data.data;
  },

  // DELETE hospital (soft delete)
  deleteHospital: async (id) => {
    const res = await api.delete(`/hospitals/${id}`);
    return res.data.data;
  }
};

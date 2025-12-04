import api from "./axiosInterceptor";

export const healthRecordAPI = {
  // Get health records with filters
  getHealthRecords: async (params = {}) => {
    const response = await api.get("/health-records", { params });
    return response.data;
  },

  // Get single health record by ID
  getHealthRecordById: async (id) => {
    const response = await api.get(`/health-records/${id}`);
    return response.data;
  },

  // Create health record
  createHealthRecord: async (data) => {
    const response = await api.post("/health-records", data);
    return response.data;
  },

  // Update health record
  updateHealthRecord: async (id, data) => {
    const response = await api.put(`/health-records/${id}`, data);
    return response.data;
  },

  // Delete health record
  deleteHealthRecord: async (id) => {
    const response = await api.delete(`/health-records/${id}`);
    return response.data;
  },

  // Get patient's health records (for doctors)
  getPatientRecords: async (patientId, params = {}) => {
    const response = await api.get(`/health-records/patient/${patientId}`, { params });
    return response.data;
  },
};
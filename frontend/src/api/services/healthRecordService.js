import api from '../axiosInterceptor';

export const healthRecordService = {
  getHealthRecords: async (params = {}) => {
    const response = await api.get('/health-records', { params });
    return response.data;
  },

  getHealthRecordById: async (id) => {
    const response = await api.get(`/health-records/${id}`);
    return response.data;
  },

  createHealthRecord: async (recordData) => {
    const response = await api.post('/health-records', recordData);
    return response.data;
  },

  updateHealthRecord: async (id, updateData) => {
    const response = await api.patch(`/health-records/${id}`, updateData);
    return response.data;
  },

  deleteHealthRecord: async (id) => {
    const response = await api.delete(`/health-records/${id}`);
    return response.data;
  }
};
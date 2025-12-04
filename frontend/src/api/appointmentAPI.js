import api from "./axiosInterceptor";

export const appointmentAPI = {
  // Get appointments with filters
  getAppointments: async (params = {}) => {
    const response = await api.get("/appointments", { params });
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create appointment
  createAppointment: async (data) => {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id, reason) => {
    const response = await api.patch(`/appointments/${id}/cancel`, { cancellationReason: reason });
    return response.data;
  },

  // Get available slots
  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get("/appointments/slots", { params: { doctorId, date } });
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status, notes = "") => {
    const response = await api.patch(`/appointments/${id}/status`, { status, notes });
    return response.data;
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (limit = 5) => {
    const response = await api.get("/appointments/upcoming", { params: { limit } });
    return response.data;
  },
};
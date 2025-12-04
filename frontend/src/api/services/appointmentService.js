import api from "../axiosInterceptor";

export const appointmentService = {
  getAppointments(params = {}) {
    return api
      .get("/appointments", { params })
      .then(res => res.data.data);
  },

  getAppointmentById(id) {
    return api
      .get(`/appointments/${id}`)
      .then(res => res.data.data);
  },

  getAvailableSlots(params) {
    return api
      .get("/appointments/slots", { params })
      .then(res => res.data.data);
  },

  createAppointment(payload) {
    return api
      .post("/appointments", payload)
      .then(res => res.data.data);
  },

  cancelAppointment(id, reason) {
    return api
      .patch(`/appointments/${id}/cancel`, { cancellationReason: reason })
      .then(res => res.data.data);
  },

  updateAppointment(id, payload) {
    return api
      .patch(`/appointments/${id}`, payload)
      .then(res => res.data.data);
  }
};

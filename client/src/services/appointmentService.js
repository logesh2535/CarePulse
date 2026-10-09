import api from './api';

export const appointmentService = {
  bookAppointment: async (bookingData) => {
    const res = await api.post('/appointments', bookingData);
    return res.data;
  },

  getAppointments: async (params = {}) => {
    const res = await api.get('/appointments', { params });
    return res.data;
  },

  getAppointmentById: async (id) => {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  updateAppointmentStatus: async (id, statusData) => {
    const res = await api.put(`/appointments/${id}/status`, statusData);
    return res.data;
  },

  cancelAppointment: async (id) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  }
};

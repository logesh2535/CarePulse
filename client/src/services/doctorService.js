import api from './api';

export const doctorService = {
  getDoctors: async (params = {}) => {
    const res = await api.get('/doctors', { params });
    return res.data;
  },

  getDoctorById: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  createDoctor: async (doctorData) => {
    const res = await api.post('/doctors', doctorData);
    return res.data;
  },

  updateDoctor: async (id, doctorData) => {
    const res = await api.put(`/doctors/${id}`, doctorData);
    return res.data;
  },

  deleteDoctor: async (id) => {
    const res = await api.delete(`/doctors/${id}`);
    return res.data;
  }
};

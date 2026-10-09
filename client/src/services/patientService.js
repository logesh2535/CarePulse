import api from './api';

export const patientService = {
  getPatients: async () => {
    const res = await api.get('/patients');
    return res.data;
  },

  getPatientById: async (id) => {
    const res = await api.get(`/patients/${id}`);
    return res.data;
  },

  updatePatient: async (id, data) => {
    const res = await api.put(`/patients/${id}`, data);
    return res.data;
  }
};

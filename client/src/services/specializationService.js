import api from './api';

export const specializationService = {
  getSpecializations: async () => {
    const res = await api.get('/specializations');
    return res.data;
  },

  createSpecialization: async (data) => {
    const res = await api.post('/specializations', data);
    return res.data;
  },

  updateSpecialization: async (id, data) => {
    const res = await api.put(`/specializations/${id}`, data);
    return res.data;
  },

  deleteSpecialization: async (id) => {
    const res = await api.delete(`/specializations/${id}`);
    return res.data;
  }
};

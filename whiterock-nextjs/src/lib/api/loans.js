import api from './axios';

export const loansApi = {
  list: async (params = {}) => {
    const { data } = await api.get('/api/loans/', { params });
    return data.results ?? data;
  },
  get: async (id) => {
    const { data } = await api.get(`/api/loans/${id}/`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/loans/', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/api/loans/${id}/`, payload);
    return data;
  },
  updateStage: async (id, stage) => {
    const { data } = await api.patch(`/api/loans/${id}/`, { stage });
    return data;
  },
};

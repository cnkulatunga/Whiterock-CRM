import api from './axios';

export const lendersApi = {
  list: async (params = {}) => {
    const { data } = await api.get('/api/lenders/', { params });
    return data;
  },
  get: async (id) => {
    const { data } = await api.get(`/api/lenders/${id}/`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/lenders/', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/api/lenders/${id}/`, payload);
    return data;
  },
};

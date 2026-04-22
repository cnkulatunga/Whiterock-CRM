import api from './axios';

export const usersApi = {
  list: async (params = {}) => {
    const { data } = await api.get('/api/users/', { params });
    return data;
  },
  get: async (id) => {
    const { data } = await api.get(`/api/users/${id}/`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/users/', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/api/users/${id}/`, payload);
    return data;
  },
  toggleActive: async (id, is_active) => {
    const { data } = await api.patch(`/api/users/${id}/`, { is_active });
    return data;
  },
};

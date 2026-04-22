import api from './axios';

export const tasksApi = {
  list: async (params = {}) => {
    const { data } = await api.get('/api/tasks/', { params });
    return data.results ?? data;
  },
  create: async (payload) => {
    const { data } = await api.post('/api/tasks/', payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/api/tasks/${id}/`, payload);
    return data;
  },
  delete: async (id) => {
    await api.delete(`/api/tasks/${id}/`);
  },
};

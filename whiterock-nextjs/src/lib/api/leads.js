import api from './axios';

export const leadsApi = {
  list: async (params = {}) => {
    const { data } = await api.get('/api/leads/', { params });
    return data; // { count, results }
  },

  get: async (id) => {
    const { data } = await api.get(`/api/leads/${id}/`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/api/leads/', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(`/api/leads/${id}/`, payload);
    return data;
  },

  delete: async (id) => {
    await api.delete(`/api/leads/${id}/`);
  },

  addNote: async (id, note) => {
    const { data } = await api.post(`/api/leads/${id}/notes/`, { content: note });
    return data;
  },

  getNotes: async (id) => {
    const { data } = await api.get(`/api/leads/${id}/notes/`);
    return data;
  },

  updateStage: async (id, stage) => {
    const { data } = await api.patch(`/api/leads/${id}/`, { stage });
    return data;
  },
};

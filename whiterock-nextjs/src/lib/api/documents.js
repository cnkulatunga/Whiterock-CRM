import api from './axios';

export const documentsApi = {
  list: async (params = {}) => {
    const { data } = await api.get('/api/documents/', { params });
    return data.results ?? data;
  },
  upload: async (file, metadata) => {
    const form = new FormData();
    form.append('file', file);
    Object.entries(metadata).forEach(([k, v]) => form.append(k, v));
    const { data } = await api.post('/api/documents/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  delete: async (id) => {
    await api.delete(`/api/documents/${id}/`);
  },
};

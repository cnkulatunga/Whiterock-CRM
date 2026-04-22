import api from './axios';

export const reportsApi = {
  getSummary: async () => {
    const { data } = await api.get('/api/reports/summary/');
    return data;
  },
  getLogs: async (params = {}) => {
    const { data } = await api.get('/api/reports/logs/', { params });
    return data;
  },
};

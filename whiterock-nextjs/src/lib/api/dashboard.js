import api from './axios';

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get('/api/dashboard/stats/');
    return data;
  },
  getTeleStats: async () => {
    const { data } = await api.get('/api/dashboard/tele-stats/');
    return data;
  },
  getActivity: async () => {
    const { data } = await api.get('/api/dashboard/activity/');
    return data;
  },
  getRecentLeads: async () => {
    const { data } = await api.get('/api/dashboard/recent-leads/');
    return data;
  },
};

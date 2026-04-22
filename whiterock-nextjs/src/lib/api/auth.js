import api from './axios';

export const authApi = {
  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login/', { email, password });
    return data; // { access, refresh, user }
  },

  logout: async () => {
    try {
      const refresh = require('js-cookie').default.get('refresh_token');
      if (refresh) await api.post('/api/auth/logout/', { refresh });
    } catch { /* ignore */ }
  },

  refreshToken: async (refresh) => {
    const { data } = await api.post('/api/auth/token/refresh/', { refresh });
    return data;
  },

  me: async () => {
    const { data } = await api.get('/api/auth/me/');
    return data;
  },

  changePassword: async (payload) => {
    const { data } = await api.post('/api/auth/change-password/', payload);
    return data;
  },
};

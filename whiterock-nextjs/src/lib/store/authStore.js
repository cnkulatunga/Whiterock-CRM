import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api/auth';

const COOKIE_OPTS = { expires: 1, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' };

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:      null,
      isLoading: false,

      setUser: (user, accessToken, refreshToken) => {
        Cookies.set('access_token', accessToken, COOKIE_OPTS);
        Cookies.set('refresh_token', refreshToken, { ...COOKIE_OPTS, expires: 7 });
        set({ user });
      },

      logout: async () => {
        await authApi.logout();
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ user: null });
        if (typeof window !== 'undefined') window.location.href = '/login';
      },

      refreshUser: async () => {
        set({ isLoading: true });
        try {
          const user = await authApi.me();
          set({ user, isLoading: false });
        } catch {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'whiterock-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

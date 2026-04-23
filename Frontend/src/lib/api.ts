import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh,
        });
        useAuthStore.getState().setTokens(data.access, refresh!);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(err);
  }
);

// ── API helpers ──────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/token/", { email, password }),
  me: () => api.get("/auth/me/"),
};

export const leadsApi = {
  list: (params?: Record<string, unknown>) => api.get("/leads/", { params }),
  get: (id: string) => api.get(`/leads/${id}/`),
  create: (data: unknown) => api.post("/leads/", data),
  update: (id: string, data: unknown) => api.patch(`/leads/${id}/`, data),
  delete: (id: string) => api.delete(`/leads/${id}/`),
};

export const tasksApi = {
  list: (params?: Record<string, unknown>) => api.get("/tasks/", { params }),
  create: (data: unknown) => api.post("/tasks/", data),
  update: (id: string, data: unknown) => api.patch(`/tasks/${id}/`, data),
  delete: (id: string) => api.delete(`/tasks/${id}/`),
};

export const lendersApi = {
  list: () => api.get("/lenders/"),
  get: (id: string) => api.get(`/lenders/${id}/`),
  create: (data: unknown) => api.post("/lenders/", data),
  update: (id: string, data: unknown) => api.patch(`/lenders/${id}/`, data),
  delete: (id: string) => api.delete(`/lenders/${id}/`),
};

export const documentsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get("/documents/", { params }),
  upload: (formData: FormData) =>
    api.post("/documents/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) => api.delete(`/documents/${id}/`),
};

export const usersApi = {
  list: () => api.get("/users/"),
  create: (data: unknown) => api.post("/users/", data),
  update: (id: string, data: unknown) => api.patch(`/users/${id}/`, data),
  delete: (id: string) => api.delete(`/users/${id}/`),
};

export const dashboardApi = {
  stats: () => api.get("/dashboard/stats/"),
};

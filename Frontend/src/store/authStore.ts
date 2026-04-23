import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "Admin" | "Team Leader" | "Tele Agent" | "Accounts Manager";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  avatarBg: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: "crm-auth" }
  )
);

export const ROLE_NAV: Record<UserRole, string[]> = {
  Admin: ["dashboard", "tasks", "leads", "pipeline", "lenders", "docs", "users", "reports"],
  "Team Leader": ["dashboard", "tasks", "leads"],
  "Tele Agent": ["dashboard", "tasks", "leads"],
  "Accounts Manager": ["dashboard", "tasks", "leads", "lenders"],
};

// All roles land on /dashboard — role-specific content is shown inside
export const ROLE_LANDING: Record<UserRole, string> = {
  Admin: "/dashboard",
  "Team Leader": "/dashboard",
  "Tele Agent": "/dashboard",
  "Accounts Manager": "/dashboard",
};

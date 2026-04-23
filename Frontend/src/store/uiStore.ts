import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  activeDrawer: string | null;
  toggleSidebar: () => void;
  openDrawer: (name: string) => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeDrawer: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openDrawer: (name) => set({ activeDrawer: name }),
  closeDrawer: () => set({ activeDrawer: null }),
}));

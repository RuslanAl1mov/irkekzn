import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
}

export const useSidebarState = create<SidebarState>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setSidebar: (open) => set({ isOpen: open }),
}));

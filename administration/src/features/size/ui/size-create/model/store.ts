import { create } from "zustand";

interface SizeCreateState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useSizeCreateStore = create<SizeCreateState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

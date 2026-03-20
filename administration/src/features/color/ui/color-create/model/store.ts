import { create } from "zustand";

interface ColorCreateState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useColorCreateStore = create<ColorCreateState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

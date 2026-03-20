import type { IColor } from "@/entities/color";
import { create } from "zustand";

interface ColorEditState {
  isOpen: boolean;
  color: IColor | null;
  open: (color: IColor) => void;
  close: () => void;
}

export const useColorEditStore = create<ColorEditState>((set) => ({
  isOpen: false,
  color: null,
  open: (color) => set({ isOpen: true, color }),
  close: () => set({ isOpen: false, color: null }),
}));

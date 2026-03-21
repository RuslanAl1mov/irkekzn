import { create } from "zustand";

import type { ISize } from "@/entities/size";

interface SizeEditState {
  isOpen: boolean;
  size: ISize | null;
  open: (size: ISize) => void;
  close: () => void;
}

export const useSizeEditStore = create<SizeEditState>((set) => ({
  isOpen: false,
  size: null,
  open: (size) => set({ isOpen: true, size }),
  close: () => set({ isOpen: false, size: null }),
}));

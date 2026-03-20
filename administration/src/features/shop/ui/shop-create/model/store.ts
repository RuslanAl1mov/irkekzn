import { create } from "zustand";

interface ShopCreateState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useShopCreateStore = create<ShopCreateState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

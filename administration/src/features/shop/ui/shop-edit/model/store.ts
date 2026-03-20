import type { IShop } from "@/entities/shop";
import { create } from "zustand";

interface ShopEditState {
  isOpen: boolean;
  shop: IShop | null;
  open: (shop: IShop) => void;
  close: () => void;
}

export const useShopEditStore = create<ShopEditState>((set) => ({
  isOpen: false,
  shop: null,
  open: (shop) => set({ isOpen: true, shop }),
  close: () => set({ isOpen: false, shop: null }),
}));

import { create } from "zustand";
import type { IShop } from "@/entities/shop";

interface ShopInfoState {
    isOpen: boolean;
    shop: IShop | null;
    open: (shop: IShop) => void;
    close: () => void;
}


export const useShopInfoStore = create<ShopInfoState>((set) => ({
    isOpen: false,
    shop: null,
    open: (shop) => set({ isOpen: true, shop }),
    close: () => set({ isOpen: false, shop: null }),
}));
import { create } from "zustand";
import type { IUser } from "@/entities/user";

interface EmployeeEditState {
    isOpen: boolean;
    user: IUser | null;
    open: (user: IUser) => void;
    close: () => void;
}

export const useEmployeeEditStore = create<EmployeeEditState>((set) => ({
    isOpen: false,
    user: null,
    open: (user) => set({ isOpen: true, user }),
    close: () => set({ isOpen: false, user: null }),
}));

import { create } from "zustand";

import type { IUser } from "./type.ts";

type AuthState = {
  isAuth: boolean;
  user: IUser | null;
  setIsAuth: (auth: boolean) => void;
  setUser: (user: IUser | null) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  user: null,
  setIsAuth: (auth) => set({ isAuth: auth }),
  setUser: (user) => set({ user }),
  reset: () => set({ isAuth: false, user: null }),
}));

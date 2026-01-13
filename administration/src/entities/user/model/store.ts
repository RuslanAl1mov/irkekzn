
import { create } from 'zustand';
import type { IUser } from './type';

type AuthState = {
	isAuth: boolean;
	setIsAuth: (auth: boolean) => void;
	user: IUser | null;
	setUser: (user: IUser | null) => void;
	reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	isAuth: true,
	user: null,
	setIsAuth: (auth) => set({ isAuth: auth }),
	setUser: (user) => set({ user }),
	reset: () => set({ isAuth: false, user: null }),
}));

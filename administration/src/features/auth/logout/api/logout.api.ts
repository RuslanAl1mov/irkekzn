import { useAuthStore } from '@/entities/user/model/store';
import $api from '@/api/base';

export const logout = async () => {
	try {
		await $api.post('/auth/logout/', {}, { withCredentials: true });
	} catch (error) {
		console.warn('Logout request failed:', error);
	}

	// Сбрасываем состояние в Zustand
    useAuthStore.getState().reset();
};

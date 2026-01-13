import { useAuthStore } from '@/entities/user';
import { checkAuth } from '../api/checkAuth.api';
import { useQuery } from '@tanstack/react-query';

export function useCheckAuth({ enabled }: { enabled: boolean }) {
	const { setIsAuth, setUser } = useAuthStore();

	return useQuery({
		queryKey: ['check-auth'],
		queryFn: async () => {
			try {
				const res = await checkAuth();
				setIsAuth(true);
				setUser(res.data.user);
				return res.data;
			} catch (error) {
				localStorage.removeItem('token');
				setIsAuth(false);
				setUser(null);
				throw error;
			}
		},
		enabled,
		retry: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		retryOnMount: false,
		refetchOnWindowFocus: false,
	});
}

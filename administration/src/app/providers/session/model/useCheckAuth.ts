import { getMe, useAuthStore } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';

export function useCheckAuth({ enabled }: { enabled: boolean }) {
	const { setIsAuth, setUser } = useAuthStore();

	return useQuery({
		queryKey: ['check-auth'],
		queryFn: async () => {
			try {
				const user = await getMe();
				setIsAuth(true);
				setUser(user);
				return user;
			} catch (error) {
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

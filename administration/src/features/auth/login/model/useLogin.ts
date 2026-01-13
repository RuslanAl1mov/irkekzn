import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login } from '../api/login.api';
import { useAuthStore } from '@/entities/user';
import type { AxiosError } from 'axios';

export function useLogin({
	onError,
	onSuccess,
}: {
	onError?: (error: AxiosError<{ error: string }>) => void;
	onSuccess?: () => void;
}) {
	const { setIsAuth, setUser } = useAuthStore();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) =>
			login(email, password),
		onSuccess: (response) => {
			console.log("response", response)
			setIsAuth(true);
			setUser(response.data);
			onSuccess?.();
			navigate('/');
		},
		onError: (error: AxiosError<{ error: string }>) => {
			setIsAuth(false);
			setUser(null);
			onError?.(error);
		},
	});
}

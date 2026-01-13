import { useAuthStore } from '@/entities/user';
import { Navigate, useLocation } from 'react-router';
import { useCheckAuth } from '../model/useCheckAuth';
import { Loader } from '@/shared/ui/loader/Loader';


export function RequireAuth({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const { isAuth } = useAuthStore();
	const { isLoading } = useCheckAuth({ enabled: true });

	console.log('is runned');

	if (isLoading) {
		return <Loader width={30} />;
	}

	if (!isAuth) {
		return <Navigate to='/login' replace state={{ from: location }} />;
	}

	return <>{children}</>;
}

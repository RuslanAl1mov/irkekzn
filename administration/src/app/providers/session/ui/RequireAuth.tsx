import cls from "./RequireAuth.module.css";
import { Navigate, useLocation } from "react-router";

import { useAuthStore } from "@/entities/user";
import { Loader } from "@/widgets/loader";

import { useCheckAuth } from "../model/useCheckAuth";
import { usePermission } from "../model/usePermissions";


export function RequireAuth({
	children,
	requiredPerms,
	onlySuperuser,
}: {
	children: React.ReactNode;
	requiredPerms?: string[];
	onlySuperuser?: boolean;
}) {
	const location = useLocation();
	const { isAuth, user } = useAuthStore();
	const { isLoading } = useCheckAuth({ enabled: true });
	const { hasAny } = usePermission();
	const isForbiddenPage = location.pathname === "/forbidden";

	// Заставка загрузки
	if (isLoading) {
		return (
			<div className={cls.loaderBlock}>
				<Loader size={40} />
			</div>
		);
	}

	// Проверка авторизации
	if (!isAuth) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	// Проверка на сотрудника
	if (!user?.is_staff && !isForbiddenPage) {
		return <Navigate to="/forbidden" replace />;
	}

	// Проверка на суперпользователя
	if (onlySuperuser && !user?.is_superuser) {
		return <Navigate to="/forbidden" replace />;
	}

	// Проверка прав доступов
	if (requiredPerms && !hasAny(requiredPerms)) {
		return <Navigate to="/forbidden" replace />;
	}

	return <>{children}</>;
}

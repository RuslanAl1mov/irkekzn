import { Outlet } from 'react-router';
import cn from 'classnames';
import cls from './AppShell.module.css';

import { useSidebarState } from "@/widgets/sidebar";
import { Sidebar } from '@/widgets/sidebar';

import { ClientEditForm } from '@/features/client/ui/client-edit';
import { EmployeeEditForm } from '@/features/employee/ui/employee-edit';
import { ClientInfoForm } from '@/features/client/ui/client-info';
import { EmployeeInfoForm } from '@/features/employee/ui/employee-info';
import { EmployeeCreateForm } from '@/features/employee/ui/employee-create';
import { ShopCreateForm } from '@/features/shop/ui/shop-create';
import { ShopEditForm } from '@/features/shop/ui/shop-edit';
import { ShopInfoForm } from '@/features/shop/ui/shop-info';
import { ConfirmationModal } from '@/widgets/confirmation';
import { ColorCreateForm } from '@/features/color';
import { ColorEditForm } from '@/features/color';

export const AppShell = () => {
	const { isOpen: isSidebarOpen } = useSidebarState();
	return (
		<div className={cls.mainLayout}>
			<Sidebar />
			<div className={cn(cls.allContent, isSidebarOpen && cls.wideSidbar)}>
				<Outlet />
			</div>

			{/* Модальные окна системы */}
			<ConfirmationModal />

			{/* Клиенты */}
			<ClientInfoForm />
			<ClientEditForm />
			{/* Сотрудники */}
			<EmployeeCreateForm />
			<EmployeeInfoForm />
			<EmployeeEditForm />
			{/* Магазины */}
			<ShopCreateForm />
			<ShopEditForm />
			<ShopInfoForm />
			{/* Цвета */}
			<ColorCreateForm />
			<ColorEditForm />
		</div>
	);
};

import { Outlet } from 'react-router';
import cn from 'classnames';
import cls from './AppShell.module.css';

import { useSidebarState } from "@/widgets/sidebar";
import { Sidebar } from '@/widgets/sidebar';

import { ClientEditForm } from '@/features/client-edit';
import { EmployeeEditForm } from '@/features/employee-edit';
import { ClientInfoForm } from '@/features/client-info';
import { EmployeeInfoForm } from '@/features/employee-info';
import { EmployeeCreateForm } from '@/features/employee-create';
import { ShopCreateForm } from '@/features/shop-create';
import { ShopEditForm } from '@/features/shop-edit';
import { ConfirmationModal } from '@/widgets/confirmation';


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
		</div>
	);
};

import { Outlet } from 'react-router';
import cn from 'classnames';
import cls from './AppShell.module.css';

import { useSidebarState } from "@/widgets/sidebar";
import { Sidebar } from '@/widgets/sidebar';

import { ClientEditForm } from '@/features/client-edit';
import { EmployeeEditForm } from '@/features/employee-edit';


export const AppShell = () => {
	const { isOpen: isSidebarOpen } = useSidebarState();
	return (
		<div className={cls.mainLayout}>
			<Sidebar />
			<div className={cn(cls.allContent, isSidebarOpen && cls.wideSidbar)}>
				<Outlet />
			</div>
			{/* Модальные окна системы */}
			<ClientEditForm />
			<EmployeeEditForm />
		</div>
	);
};

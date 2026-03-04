import { Outlet } from 'react-router';
import cn from 'classnames';
import cls from './AppShell.module.css';

import { useSidebarState } from "@/widgets/sidebar";
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';


export const AppShell = () => {
	const { isOpen: isSidebarOpen } = useSidebarState();
	return (
		<div className={cls.mainLayout}>
			<Header />
			<Sidebar />
			<div className={cn(cls.allContent, isSidebarOpen && cls.wideSidbar)}>
				<Outlet />
			</div>
		</div>
	);
};

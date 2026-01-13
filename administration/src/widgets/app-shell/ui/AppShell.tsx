import { Outlet, useLocation } from 'react-router';
import cn from 'classnames';
import cls from './AppShell.module.css';
import Aside from '@/widgets/sidebar/Sidebar';
import Header from '@/widgets/header/Header';

import { useSidebarState } from "@/widgets/sidebar/model/store";


const HeaderLayout = () => {
	const location = useLocation();

	const hideHeaderRoutes = ['/login'];
	const shouldHideHeader = hideHeaderRoutes.some(route => location.pathname.startsWith(route));

	return (
		<>
			{!shouldHideHeader && <Header />}
		</>
	);
};

const AsideLayout = () => {
	const location = useLocation();

	const hideHeaderRoutes = ['/login'];
	const shouldHideHeader = hideHeaderRoutes.some(route => location.pathname.startsWith(route));

	return (
		<>
			{!shouldHideHeader && <Aside />}
		</>
	);
};

export const AppShell = () => {
  	const { isOpen: isSidebarOpen } = useSidebarState();
	return (
		<div className={cls.mainLayout}>
			<HeaderLayout />
			<AsideLayout />
			<div className={cn(cls.allContent, isSidebarOpen && cls.wideSidbar)}>
				<Outlet />
			</div>
		</div>
	);
};

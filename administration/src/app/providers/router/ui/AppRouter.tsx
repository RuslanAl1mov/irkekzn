import LoginPage from '@/pages/loginPage/ui/LoginPage';
import { Route, Routes, Navigate } from 'react-router';
import { RequireAuth } from '../../session';
import { AppShell } from '@/widgets/app-shell';
import DashboardPage from '@/pages/dashboard/ui/Dashboard';
// import { AppShell } from '@/widgets/app-shell';
// import DashboardPage from '@/pages/dashboard/ui/Dashboard';


export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/" element={<AppShell />} >

				<Route index element={<Navigate to="dashboard" replace />} />

				<Route path="dashboard" element={
					<RequireAuth>
						<DashboardPage />
					</RequireAuth >
				} />

			</Route>
		</Routes>
	);
};

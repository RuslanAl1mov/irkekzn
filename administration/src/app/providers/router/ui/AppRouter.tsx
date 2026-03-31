import { LoginPage } from '@/pages/loginPage';
import { Route, Routes, Navigate } from 'react-router';
import { RequireAuth } from '../../session';
import { AppShell } from '@/widgets/app-shell';
import { Dashboard } from '@/pages/dashboard';
import { Clients } from '@/pages/clients';
import { Employees } from '@/pages/employees';
import { Shops } from '@/pages/shops';
import { Settings } from '@/pages/settings';
import { Profile } from '@/pages/profile';
import { ProductCategories } from '@/pages/product-categories';


export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/" element={<AppShell />} >

				<Route index element={<Navigate to="dashboard/" replace />} />

				<Route path="dashboard/" element={
					<RequireAuth>
						<Dashboard />
					</RequireAuth >
				} />

				<Route path="clients/" element={
					<RequireAuth>
						<Clients />
					</RequireAuth>
				} />

				<Route path="employees/" element={
					<RequireAuth>
						<Employees />
					</RequireAuth>
				} />

				<Route path="shops/" element={
					<RequireAuth>
						<Shops />
					</RequireAuth>
				} />
			
				<Route path="settings/" element={
					<RequireAuth>
						<Settings />
					</RequireAuth>
				} />

				<Route path="profile/" element={
					<RequireAuth>
						<Profile />
					</RequireAuth>
				} />

				<Route path="categories/" element={
					<RequireAuth>
						<ProductCategories />
					</RequireAuth>
				} />

				<Route path="product-cards/" element={
					<RequireAuth>
						<div></div>
					</RequireAuth>
				} />

				<Route path="products/" element={
					<RequireAuth>
						<div></div>
					</RequireAuth>
				} />

				<Route path="products-stock/" element={
					<RequireAuth>
						<div></div>
					</RequireAuth>
				} />

			</Route>
		</Routes>
	);
};

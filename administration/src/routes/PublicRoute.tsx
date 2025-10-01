import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return <div>Загрузка…</div>;
  }

  if (isAuthenticated) {
    // если есть state.from — идём туда, иначе — на корень
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

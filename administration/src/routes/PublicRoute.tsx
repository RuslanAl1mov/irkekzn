import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, booting } = useAuth();

  if (booting) {
    return <div>Загрузка…</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

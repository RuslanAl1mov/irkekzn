import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  perm?: string | null;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  perm = null 
}) => {
  const { isAuthenticated, user, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return <div>Загрузка…</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (perm) {
    const perms: string[] = Array.isArray(user?.permissions) ? user!.permissions! : [];
    const hasPerm = perms.includes(perm);

    if (!hasPerm) {
      return <Navigate to="/no-access" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;

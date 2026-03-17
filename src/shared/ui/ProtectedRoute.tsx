import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStatus } from '@/features/auth/hooks';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStatus();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStatus } from '@/features/auth/hooks';
import type { UserRole } from '@/entities/User';
import { LoadingState } from './LoadingState';

export function ProtectedRoute({ requiredRole }: { requiredRole?: UserRole }) {
  const { isAdmin, isAuthenticated, isAuthResolved } = useAuthStatus();
  const location = useLocation();

  if (!isAuthResolved) {
    return <LoadingState label="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import authStore from '../store/authStore';

export const ProtectedRoute = () => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
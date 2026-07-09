import { Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import authStore from '../store/authStore';

export const ProtectedRoute = () => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
};

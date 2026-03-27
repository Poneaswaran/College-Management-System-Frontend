import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string | string[];
}

/**
 * ProtectedRoute Component
 * Guards routes based on user authentication and role
 * Redirects unauthorized users to login page
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const user = useSelector(selectCurrentUser);

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check role authorization
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasRequiredRole = roles.includes(user.role?.code);

  if (!hasRequiredRole) {
    // Redirect based on user's actual role
    const roleRoutes: Record<string, string> = {
      STUDENT: '/student/dashboard',
      FACULTY: '/faculty/dashboard',
      HOD: '/hod/dashboard',
      ADMIN: '/admin/dashboard',
    };

    const redirectPath = roleRoutes[user.role?.code] || '/auth/login';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

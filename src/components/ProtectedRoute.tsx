import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'admin')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useStore();
  const location = useLocation();

  if (!user || !user.isLoggedIn) {
    // Redirect to login but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user.role || 'customer';

  if (allowedRoles && !allowedRoles.includes(currentRole as 'customer' | 'admin')) {
    // Role not authorized
    if (currentRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />; // Or to a specific unauthorized page
    }
  }

  return <>{children}</>;
}

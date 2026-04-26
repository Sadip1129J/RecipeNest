// ProtectedRoute.jsx — guards routes based on auth and role
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  // Not logged in — redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Role check: if roles array is specified, user must have one of them
  if (roles && !roles.includes(user.role)) {
    // Redirect to their own dashboard
    if (user.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'Chef') return <Navigate to="/chef-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
}

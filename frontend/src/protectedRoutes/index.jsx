// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireTopAdmin = false,
}) => {
  const userData = useSelector((state) => state.auth.userData);
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (isAuthenticated === 'true' && (isAuthenticating || userData === null)) {
    return <Loader />;
  }

  // Not logged in or definitely not authenticated
  if (!userData && isAuthenticated !== 'true') {
    return <Navigate to="/login" />;
  }

  // Require top admin only
  if (requireTopAdmin && userData?.role !== 'top_admin') {
    return <Navigate to="/" />;
  }

  // Require admin (or top_admin)
  if (requireAdmin && !['admin', 'top_admin'].includes(userData?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

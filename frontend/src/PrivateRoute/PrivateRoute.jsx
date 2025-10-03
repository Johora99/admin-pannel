import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading user information...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.status === 'blocked' || user.status === 'deleted' || user.isDeleted) {
    return <Navigate to="/" replace />;
  }
  return children || <Outlet />;
}

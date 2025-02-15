import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
} 
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectIfIncomplete?: boolean;
}

const ProtectedRoute = ({
  children,
  requiredRole,
  redirectIfIncomplete = false,
}: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (redirectIfIncomplete && !user.username) {
    return <Navigate to="/edit-profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

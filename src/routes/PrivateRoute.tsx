import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'MAESTRO' | 'CONTROL_ESCOLAR';
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, usuario, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole && usuario?.rol !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
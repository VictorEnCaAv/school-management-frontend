import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PrivateRoute } from './PrivateRoute';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CalificacionesPage from '../pages/maestro/CalificacionesPage';
import ReportesPage from '../pages/admin/ReportesPage';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Ruta pública */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Rutas del Maestro */}
      <Route
        path="/maestro/calificaciones"
        element={
          <PrivateRoute requiredRole="MAESTRO">
            <CalificacionesPage />
          </PrivateRoute>
        }
      />

      {/* Rutas del Control Escolar */}
      <Route
        path="/admin/reportes"
        element={
          <PrivateRoute requiredRole="CONTROL_ESCOLAR">
            <ReportesPage />
          </PrivateRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* 404 - Página no encontrada */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600">Página no encontrada</p>
            </div>
          </div>
        } 
      />
    </Routes>
  );
};
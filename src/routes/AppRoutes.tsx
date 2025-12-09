// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Páginas públicas
import Login from '../pages/Login';

// Dashboard (único, se adapta según el rol)
import Dashboard from '../pages/Dashboard';

// Páginas de maestro
import CalificacionesPage from '../pages/maestro/CalificacionesPage';

// Páginas de control escolar
import ReportesPage from '../pages/admin/ReportesPage';
import SupervisionPage from '../pages/admin/SupervisionPage';

// Componente de ruta protegida
const PrivateRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, usuario } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && usuario?.rol !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          } 
        />

        {/* Dashboard según rol */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Rutas de MAESTRO */}
        <Route
          path="/maestro/calificaciones"
          element={
            <PrivateRoute requiredRole="MAESTRO">
              <CalificacionesPage />
            </PrivateRoute>
          }
        />

        {/* Rutas de CONTROL_ESCOLAR */}
        <Route
          path="/control-escolar/reportes"
          element={
            <PrivateRoute requiredRole="CONTROL_ESCOLAR">
              <ReportesPage />
            </PrivateRoute>
          }
        />

        {/* RUTA: Supervisión de calificaciones */}
        <Route
          path="/control-escolar/supervision"
          element={
            <PrivateRoute requiredRole="CONTROL_ESCOLAR">
              <SupervisionPage />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
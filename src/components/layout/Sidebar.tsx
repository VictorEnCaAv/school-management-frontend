// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
  const location = useLocation();
  const { usuario } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    return `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          📚 Sistema Escolar
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {usuario?.rol === 'MAESTRO' ? 'Panel Maestro' : 'Control Escolar'}
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {/* Dashboard */}
        <Link to="/dashboard" className={linkClass('/dashboard')}>
          <span className="text-xl">🏠</span>
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Rutas específicas por rol */}
        {usuario?.rol === 'MAESTRO' && (
          <>
            <Link to="/maestro/calificaciones" className={linkClass('/maestro/calificaciones')}>
              <span className="text-xl">📝</span>
              <span className="font-medium">Calificaciones</span>
            </Link>
          </>
        )}

        {usuario?.rol === 'CONTROL_ESCOLAR' && (
          <>
            <Link to="/control-escolar/reportes" className={linkClass('/control-escolar/reportes')}>
              <span className="text-xl">📊</span>
              <span className="font-medium">Reportes</span>
            </Link>
            
            {/* NUEVO ENLACE: Supervisión */}
            <Link to="/control-escolar/supervision" className={linkClass('/control-escolar/supervision')}>
              <span className="text-xl">🔍</span>
              <span className="font-medium">Supervisión</span>
            </Link>
          </>
        )}
      </nav>

      {/* Información del usuario */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {usuario?.nombre}
            </p>
            <p className="text-xs text-gray-500">
              {usuario?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
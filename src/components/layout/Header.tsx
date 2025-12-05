import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { usuario, logout, isMaestro, isControlEscolar } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Sistema de Gestión Escolar
              </h1>
              <p className="text-sm text-gray-500">
                {isMaestro && 'Panel de Maestro'}
                {isControlEscolar && 'Panel de Control Escolar'}
              </p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </button>

            {isMaestro && (
              <button
                onClick={() => navigate('/maestro/calificaciones')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Calificaciones
              </button>
            )}

            {isControlEscolar && (
              <button
                onClick={() => navigate('/admin/reportes')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Reportes
              </button>
            )}
          </nav>

          {/* Usuario y logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{usuario?.nombre}</p>
              <p className="text-xs text-gray-500">{usuario?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
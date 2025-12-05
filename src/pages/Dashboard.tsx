import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';

const Dashboard = () => {
  const { usuario, isMaestro, isControlEscolar } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {usuario?.nombre}
          </h1>
          <p className="text-gray-600">
            Panel de {isMaestro ? 'Maestro' : 'Control Escolar'}
          </p>
        </div>

        {/* Estadísticas/Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Para Maestro */}
          {isMaestro && (
            <>
              <div 
                onClick={() => navigate('/maestro/calificaciones')}
                className="card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Calificaciones
                    </h3>
                    <p className="text-sm text-gray-600">
                      Registrar y editar notas
                    </p>
                  </div>
                </div>
              </div>

              <div className="card border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Mis Alumnos
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ver alumnos asignados
                    </p>
                  </div>
                </div>
              </div>

              <div className="card border-l-4 border-purple-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Mis Materias
                    </h3>
                    <p className="text-sm text-gray-600">
                      Materias a mi cargo
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Cards - Para Control Escolar */}
          {isControlEscolar && (
            <>
              <div 
                onClick={() => navigate('/admin/reportes')}
                className="card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Reportes
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ver reportes globales
                    </p>
                  </div>
                </div>
              </div>

              <div className="card border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Estadísticas
                    </h3>
                    <p className="text-sm text-gray-600">
                      Promedios y métricas
                    </p>
                  </div>
                </div>
              </div>

              <div className="card border-l-4 border-purple-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Supervisión
                    </h3>
                    <p className="text-sm text-gray-600">
                      Control de calificaciones
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Información adicional */}
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Sistema de Gestión Escolar
              </h3>
              <p className="text-sm text-blue-800">
                {isMaestro && 'Desde este panel puedes gestionar las calificaciones de tus alumnos y consultar información relevante.'}
                {isControlEscolar && 'Desde este panel puedes supervisar todas las calificaciones, generar reportes y consultar estadísticas globales.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
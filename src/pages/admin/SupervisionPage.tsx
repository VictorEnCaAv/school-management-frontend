// src/pages/controlEscolar/SupervisionPage.tsx
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { FiltrosCalificaciones } from '../../components/controlEscolar/FiltrosCalificaciones';
import { CalificacionesControlEscolar } from '../../components/controlEscolar/CalificacionesControlEscolar';
import { calificacionService } from '../../services/calificacionService';
import { Calificacion, CalificacionesFiltros, PaginatedResponse } from '../../types';

const SupervisionPage = () => {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<CalificacionesFiltros>({
    pagina: 1,
    limite: 20,
    incluirEliminadas: false,
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    pagina: 1,
    totalPaginas: 1,
    limite: 20,
  });

  const cargarCalificaciones = async (filtrosActuales: CalificacionesFiltros) => {
    setCargando(true);
    setError(null);

    try {
      const response: PaginatedResponse<Calificacion> = 
        await calificacionService.obtenerTodasLasCalificaciones(filtrosActuales);

      setCalificaciones(response.data);
      setPaginacion(response.paginacion);
    } catch (err: any) {
      console.error('Error al cargar calificaciones:', err);
      setError(err.response?.data?.error || 'Error al cargar las calificaciones');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCalificaciones(filtros);
  }, []);

  const handleFiltrar = (nuevosFiltros: CalificacionesFiltros) => {
    const filtrosCompletos = {
      ...nuevosFiltros,
      pagina: 1,
      limite: filtros.limite,
    };
    setFiltros(filtrosCompletos);
    cargarCalificaciones(filtrosCompletos);
  };

  const handleLimpiarFiltros = () => {
    const filtrosLimpios = {
      pagina: 1,
      limite: 20,
      incluirEliminadas: false,
    };
    setFiltros(filtrosLimpios);
    cargarCalificaciones(filtrosLimpios);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta calificación?')) {
      return;
    }

    try {
      await calificacionService.eliminarCalificacion(id, 'Eliminado por control escolar');
      
      // Mostrar mensaje de éxito
      alert('✅ Calificación eliminada exitosamente');
      
      // Recargar calificaciones
      cargarCalificaciones(filtros);
    } catch (err: any) {
      console.error('Error al eliminar calificación:', err);
      alert(err.response?.data?.error || 'Error al eliminar la calificación');
    }
  };

  const handleRestaurar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de restaurar esta calificación?')) {
      return;
    }

    try {
      await calificacionService.restaurarCalificacion(id);
      
      // Mostrar mensaje de éxito
      alert('✅ Calificación restaurada exitosamente');
      
      // Recargar calificaciones
      cargarCalificaciones(filtros);
    } catch (err: any) {
      console.error('Error al restaurar calificación:', err);
      alert(err.response?.data?.error || 'Error al restaurar la calificación');
    }
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    const nuevosFiltros = { ...filtros, pagina: nuevaPagina };
    setFiltros(nuevosFiltros);
    cargarCalificaciones(nuevosFiltros);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Supervisión de Calificaciones
          </h1>
          <p className="text-gray-600">
            Visualiza y gestiona todas las calificaciones del sistema
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Total Calificaciones
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {paginacion.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="card bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">
                  Activas
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {calificaciones.filter(c => !c.deleted_at).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card bg-red-50 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium mb-1">
                  Eliminadas
                </p>
                <p className="text-3xl font-bold text-red-900">
                  {calificaciones.filter(c => c.deleted_at).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗑️</span>
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Página Actual
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {paginacion.pagina} / {paginacion.totalPaginas}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosCalificaciones
          onFiltrar={handleFiltrar}
          onLimpiar={handleLimpiarFiltros}
        />

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tabla de calificaciones */}
        <CalificacionesControlEscolar
          calificaciones={calificaciones}
          onEliminar={handleEliminar}
          onRestaurar={handleRestaurar}
          cargando={cargando}
        />

        {/* Paginación */}
        {!cargando && calificaciones.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Mostrando {calificaciones.length} de {paginacion.total} calificaciones
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCambiarPagina(paginacion.pagina - 1)}
                  disabled={paginacion.pagina === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => handleCambiarPagina(paginacion.pagina + 1)}
                  disabled={paginacion.pagina >= paginacion.totalPaginas}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SupervisionPage;
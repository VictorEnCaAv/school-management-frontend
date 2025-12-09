import { useState, useEffect } from 'react';
import { calificacionService } from '@/services/calificacionService';
import { EditarCalificacionModal } from '@/components/modals/EditarCalificacionModal';

interface Calificacion {
  id: number;
  nota: number;
  periodo: string;
  fecha_evaluacion: string;
  observaciones?: string;
  modificada_por?: number;
  fecha_modificacion?: string;
  alumno: {
    id: number;
    matricula: string;
    nombre: string;
    apellidos: string;
  };
  asignacion: {
    materia: {
      nombre: string;
      codigo: string;
    };
    grupo: {
      nombre: string;
    };
    maestro?: {
      nombre: string;
      apellidos: string;
    };
  };
  modificador?: {
    nombre: string;
    apellidos: string;
  };
}

export function SupervisionPage() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEditar, setModalEditar] = useState(false);
  const [calificacionEditar, setCalificacionEditar] = useState<Calificacion | null>(null);
  const [filtros, setFiltros] = useState({
    periodo: ''
  });

  useEffect(() => {
    cargarCalificaciones();
  }, [filtros]);

  const cargarCalificaciones = async () => {
    try {
      setLoading(true);
      const filtrosLimpios: any = {};
      if (filtros.periodo) {
        filtrosLimpios.periodo = filtros.periodo;
      }
      const data = await calificacionService.obtenerTodasLasCalificaciones(filtrosLimpios);
      setCalificaciones(data);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
      alert('Error al cargar calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarClick = (calificacion: Calificacion) => {
    setCalificacionEditar(calificacion);
    setModalEditar(true);
  };

  const handleModificarCalificacion = async (id: number, data: any) => {
    try {
      const actualizada = await calificacionService.modificarCalificacion(id, data);
      setCalificaciones(prev => 
        prev.map(c => c.id === id ? actualizada : c)
      );
      setModalEditar(false);
      setCalificacionEditar(null);
      alert('✅ Calificación modificada exitosamente');
    } catch (error: any) {
      throw error;
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta calificación? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await calificacionService.eliminarCalificacion(id);
      setCalificaciones(prev => prev.filter(c => c.id !== id));
      alert('✅ Calificación eliminada exitosamente');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al eliminar calificación');
    }
  };

  const limpiarFiltros = () => {
    setFiltros({ periodo: '' });
  };

  if (loading && calificaciones.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Supervisión de Calificaciones</h1>
        <p className="text-gray-600">
          Como Control Escolar, puedes modificar o eliminar cualquier calificación del sistema.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Periodo
            </label>
            <select
              value={filtros.periodo}
              onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los periodos</option>
              <option value="Parcial 1">Parcial 1</option>
              <option value="Parcial 2">Parcial 2</option>
              <option value="Parcial 3">Parcial 3</option>
              <option value="Final">Final</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={limpiarFiltros}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          📊 Total de calificaciones: <strong>{calificaciones.length}</strong>
        </p>
      </div>

      {/* Tabla de Calificaciones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maestro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periodo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modificada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : calificaciones.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No hay calificaciones que mostrar con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                calificaciones.map(cal => (
                  <tr 
                    key={cal.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      cal.modificada_por ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cal.alumno.nombre} {cal.alumno.apellidos}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cal.alumno.matricula}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cal.asignacion.materia.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cal.asignacion.grupo.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cal.asignacion.maestro?.nombre} {cal.asignacion.maestro?.apellidos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cal.periodo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        cal.nota >= 70 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cal.nota}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {cal.modificada_por ? (
                        <span className="text-yellow-700 font-medium">
                          ⚠️ Modificada
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                      <button
                        onClick={() => handleEditarClick(cal)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(cal.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editar */}
      {modalEditar && calificacionEditar && (
        <EditarCalificacionModal
          isOpen={modalEditar}
          onClose={() => {
            setModalEditar(false);
            setCalificacionEditar(null);
          }}
          calificacion={calificacionEditar}
          onSubmit={handleModificarCalificacion}
        />
      )}
    </div>
  );
}
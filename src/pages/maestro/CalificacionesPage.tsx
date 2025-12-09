import { useState, useEffect } from 'react';
import { asignacionService } from '@/services/asignacionService';
import { calificacionService } from '@/services/calificacionService';
import { RegistrarCalificacionModal } from '@/components/modals/RegistrarCalificacionModal';
import { EditarCalificacionModal } from '@/components/modals/EditarCalificacionModal';

interface Asignacion {
  id: number;
  maestro_id: number;
  materia_id: number;
  grupo_id: number;
  ciclo_escolar: string;
  materia: {
    id: number;
    codigo: string;
    nombre: string;
  };
  grupo: {
    id: number;
    codigo: string;
    nombre: string;
    ciclo_escolar: string;
  };
}

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

function CalificacionesPage() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [asignacionSeleccionada, setAsignacionSeleccionada] = useState<number | null>(null);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [calificacionEditar, setCalificacionEditar] = useState<Calificacion | null>(null);

  useEffect(() => {
    cargarAsignaciones();
  }, []);

  useEffect(() => {
    if (asignacionSeleccionada) {
      cargarCalificaciones();
    }
  }, [asignacionSeleccionada]);

  const cargarAsignaciones = async () => {
    try {
      const data = await asignacionService.obtenerMisAsignaciones();
      setAsignaciones(data);
      if (data.length > 0) {
        setAsignacionSeleccionada(data[0].id);
      }
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
      alert('Error al cargar asignaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarCalificaciones = async () => {
    try {
      setLoading(true);
      const data = await calificacionService.obtenerMisCalificaciones({
        asignacion_id: asignacionSeleccionada!
      });
      setCalificaciones(data);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
      alert('Error al cargar calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarCalificacion = async (data: any) => {
    try {
      const nueva = await calificacionService.registrarCalificacion({
        ...data,
        asignacion_id: asignacionSeleccionada!
      });
      setCalificaciones(prev => [nueva, ...prev]);
      setModalRegistrar(false);
      alert('✅ Calificación registrada exitosamente');
    } catch (error: any) {
      throw error;
    }
  };

  const handleEditarClick = (calificacion: Calificacion) => {
    setCalificacionEditar(calificacion);
    setModalEditar(true);
  };

  const handleActualizarCalificacion = async (id: number, data: any) => {
    try {
      const actualizada = await calificacionService.actualizarCalificacion(id, data);
      setCalificaciones(prev => 
        prev.map(c => c.id === id ? actualizada : c)
      );
      setModalEditar(false);
      setCalificacionEditar(null);
      alert('✅ Calificación actualizada exitosamente');
    } catch (error: any) {
      throw error;
    }
  };

  const asignacionActual = asignaciones.find(a => a.id === asignacionSeleccionada);

  if (loading && asignaciones.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (asignaciones.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No tienes asignaciones disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Calificaciones</h1>
        <p className="text-gray-600">Gestiona las calificaciones de tus alumnos</p>
      </div>

      {/* Selector de Materia/Grupo */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Seleccionar Materia y Grupo
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={asignacionSeleccionada || ''}
            onChange={(e) => setAsignacionSeleccionada(Number(e.target.value))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {asignaciones.map(asig => (
              <option key={asig.id} value={asig.id}>
                {asig.materia.nombre} - {asig.grupo.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info de Asignación Actual */}
      {asignacionActual && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">MATERIA</p>
              <p className="text-sm font-semibold text-gray-900">
                {asignacionActual.materia.nombre}
              </p>
              <p className="text-xs text-gray-500">
                {asignacionActual.materia.codigo}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">GRUPO</p>
              <p className="text-sm font-semibold text-gray-900">
                {asignacionActual.grupo.nombre}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">CICLO ESCOLAR</p>
              <p className="text-sm font-semibold text-gray-900">
                {asignacionActual.grupo.ciclo_escolar}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botón Registrar */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total de calificaciones: <span className="font-semibold">{calificaciones.length}</span>
        </div>
        <button
          onClick={() => setModalRegistrar(true)}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          + Registrar Calificación
        </button>
      </div>

      {/* Tabla de Calificaciones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alumno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periodo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : calificaciones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No hay calificaciones registradas para esta materia y grupo.
                    <br />
                    <span className="text-sm">Haz clic en "Registrar Calificación" para agregar una.</span>
                  </td>
                </tr>
              ) : (
                calificaciones.map(cal => (
                  <tr key={cal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cal.alumno.matricula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cal.alumno.nombre} {cal.alumno.apellidos}
                      </div>
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
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {cal.observaciones || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cal.fecha_evaluacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEditarClick(cal)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar */}
      {modalRegistrar && asignacionSeleccionada && (
        <RegistrarCalificacionModal
          isOpen={modalRegistrar}
          onClose={() => setModalRegistrar(false)}
          asignacionId={asignacionSeleccionada}
          onSubmit={handleRegistrarCalificacion}
        />
      )}

      {/* Modal Editar */}
      {modalEditar && calificacionEditar && (
        <EditarCalificacionModal
          isOpen={modalEditar}
          onClose={() => {
            setModalEditar(false);
            setCalificacionEditar(null);
          }}
          calificacion={calificacionEditar}
          onSubmit={handleActualizarCalificacion}
        />
      )}
    </div>
  );
}

export default CalificacionesPage;
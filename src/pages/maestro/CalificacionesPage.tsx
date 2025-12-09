// src/pages/maestro/CalificacionesPage.tsx
import { useState, useEffect } from 'react';
import { asignacionService, Asignacion } from '@/services/asignacionService';
import { calificacionService, Calificacion } from '@/services/calificacionService';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { RegistrarCalificacionForm } from '@/components/forms/RegistrarCalificacionForm';
import { EditarCalificacionModal } from '@/components/modals/EditarCalificacionModal';

export function CalificacionesPage() {
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
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al registrar calificación');
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
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al actualizar calificación');
    }
  };

  const asignacionActual = asignaciones.find(a => a.id === asignacionSeleccionada);

  if (loading && asignaciones.length === 0) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Mis Calificaciones</h1>

        {/* Selector de Materia/Grupo */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Materia y Grupo
          </label>
          <select
            value={asignacionSeleccionada || ''}
            onChange={(e) => setAsignacionSeleccionada(Number(e.target.value))}
            className="w-full md:w-1/2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {asignaciones.map(asig => (
              <option key={asig.id} value={asig.id}>
                {asig.materia.nombre} - {asig.grupo.nombre}
              </option>
            ))}
          </select>
        </div>

        {asignacionActual && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600">
              <strong>Materia:</strong> {asignacionActual.materia.nombre} ({asignacionActual.materia.codigo})
            </p>
            <p className="text-sm text-gray-600">
              <strong>Grupo:</strong> {asignacionActual.grupo.nombre}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Ciclo:</strong> {asignacionActual.grupo.ciclo_escolar}
            </p>
          </div>
        )}

        <Button onClick={() => setModalRegistrar(true)} variant="primary">
          + Registrar Calificación
        </Button>
      </div>

      {/* Tabla de Calificaciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Alumno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Periodo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Observaciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {calificaciones.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No hay calificaciones registradas
                </td>
              </tr>
            ) : (
              calificaciones.map(cal => (
                <tr key={cal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {cal.alumno.matricula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cal.alumno.nombre} {cal.alumno.apellidos}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cal.observaciones || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(cal.fecha_evaluacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditarClick(cal)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
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
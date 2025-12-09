// src/components/controlEscolar/CalificacionesControlEscolar.tsx
import React, { useState } from 'react';
import { Calificacion } from '../../types';

interface CalificacionesControlEscolarProps {
  calificaciones: Calificacion[];
  onEliminar: (id: number) => void;
  onRestaurar: (id: number) => void;
  cargando?: boolean;
}

export const CalificacionesControlEscolar: React.FC<CalificacionesControlEscolarProps> = ({
  calificaciones,
  onEliminar,
  onRestaurar,
  cargando = false,
}) => {
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState<number | null>(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [motivo, setMotivo] = useState('');

  const handleEliminarClick = (id: number) => {
    setCalificacionSeleccionada(id);
    setMostrarModalEliminar(true);
  };

  const handleConfirmarEliminar = () => {
    if (calificacionSeleccionada) {
      onEliminar(calificacionSeleccionada);
      setMostrarModalEliminar(false);
      setCalificacionSeleccionada(null);
      setMotivo('');
    }
  };

  const handleCancelar = () => {
    setMostrarModalEliminar(false);
    setCalificacionSeleccionada(null);
    setMotivo('');
  };

  if (cargando) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando calificaciones...</span>
        </div>
      </div>
    );
  }

  if (calificaciones.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📋</span>
          <p className="text-gray-600 text-lg">
            No se encontraron calificaciones con los filtros aplicados
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Alumno
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Materia
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Maestro
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Nota
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Periodo
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Estado
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((calif) => {
                const estaEliminada = !!calif.deleted_at;
                
                return (
                  <tr
                    key={calif.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      estaEliminada ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-600">
                      #{calif.id}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {calif.alumno?.nombre} {calif.alumno?.apellidos}
                        </p>
                        <p className="text-sm text-gray-500">
                          {calif.alumno?.matricula}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {calif.asignacion?.materia?.nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                          {calif.asignacion?.grupo?.nombre}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-800">
                        {calif.asignacion?.maestro?.nombre} {calif.asignacion?.maestro?.apellidos}
                      </p>
                      <p className="text-sm text-gray-500">
                        {calif.asignacion?.maestro?.email}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold ${
                          calif.nota >= 70
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {calif.nota}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {calif.periodo}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {estaEliminada ? (
                        <div>
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            🗑️ Eliminada
                          </span>
                          {calif.delete_reason && (
                            <p className="text-xs text-gray-500 mt-1">
                              {calif.delete_reason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✅ Activa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {estaEliminada ? (
                        <button
                          onClick={() => onRestaurar(calif.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          ♻️ Restaurar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEliminarClick(calif.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarModalEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ⚠️ Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar esta calificación? Esta acción se puede revertir posteriormente.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de eliminación (opcional)
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Ej: Calificación duplicada, error de captura..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmarEliminar}
                className="flex-1 btn-primary bg-red-600 hover:bg-red-700"
              >
                Sí, eliminar
              </button>
              <button
                onClick={handleCancelar}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
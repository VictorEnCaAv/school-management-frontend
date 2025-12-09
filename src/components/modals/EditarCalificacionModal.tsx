import { useState, useEffect } from 'react';

interface Calificacion {
  id: number;
  nota: number;
  periodo: string;
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  calificacion: Calificacion;
  onSubmit: (id: number, data: any) => Promise<void>;
}

export function EditarCalificacionModal({ isOpen, onClose, calificacion, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nota: calificacion.nota.toString(),
    observaciones: calificacion.observaciones || ''
  });

  useEffect(() => {
    if (calificacion) {
      setFormData({
        nota: calificacion.nota.toString(),
        observaciones: calificacion.observaciones || ''
      });
    }
  }, [calificacion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(calificacion.id, {
        nota: Number(formData.nota),
        observaciones: formData.observaciones
      });
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      alert(error.response?.data?.error || 'Error al actualizar calificación');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Editar Calificación</h2>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Información del Alumno (solo lectura) */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Alumno:</strong> {calificacion.alumno.nombre} {calificacion.alumno.apellidos}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Matrícula:</strong> {calificacion.alumno.matricula}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Materia:</strong> {calificacion.asignacion.materia.nombre}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Periodo:</strong> {calificacion.periodo}
            </p>
          </div>

          {/* Nota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nota (0-100) *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.nota}
              onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Comentarios sobre el desempeño del alumno..."
            />
          </div>

          {/* Info de modificación */}
          {calificacion.modificada_por && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-xs text-yellow-800 font-semibold mb-1">
                ⚠️ Modificada por Control Escolar
              </p>
              <p className="text-xs text-yellow-700">
                {calificacion.modificador?.nombre} {calificacion.modificador?.apellidos}
              </p>
              <p className="text-xs text-yellow-700">
                {new Date(calificacion.fecha_modificacion!).toLocaleString()}
              </p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
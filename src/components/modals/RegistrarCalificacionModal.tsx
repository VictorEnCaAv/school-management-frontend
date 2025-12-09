import { useState, useEffect } from 'react';
import { asignacionService } from '@/services/asignacionService';

interface Alumno {
  id: number;
  matricula: string;
  nombre: string;
  apellidos: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asignacionId: number;
  onSubmit: (data: any) => Promise<void>;
}

export function RegistrarCalificacionModal({ isOpen, onClose, asignacionId, onSubmit }: Props) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAlumnos, setLoadingAlumnos] = useState(true);
  const [formData, setFormData] = useState({
    alumno_id: '',
    nota: '',
    periodo: 'Parcial 1',
    observaciones: ''
  });

  useEffect(() => {
    if (isOpen && asignacionId) {
      cargarAlumnos();
    }
  }, [isOpen, asignacionId]);

  const cargarAlumnos = async () => {
    try {
      setLoadingAlumnos(true);
      const response = await asignacionService.obtenerAlumnosPorAsignacion(asignacionId);
      setAlumnos(response.alumnos || []);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      alert('Error al cargar lista de alumnos');
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.alumno_id || !formData.nota) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        alumno_id: Number(formData.alumno_id),
        nota: Number(formData.nota)
      });
      
      // Resetear form
      setFormData({
        alumno_id: '',
        nota: '',
        periodo: 'Parcial 1',
        observaciones: ''
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error al registrar:', error);
      alert(error.response?.data?.error || 'Error al registrar calificación');
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
          <h2 className="text-xl font-bold text-gray-900">Registrar Calificación</h2>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Alumno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alumno *
            </label>
            {loadingAlumnos ? (
              <div className="text-sm text-gray-500">Cargando alumnos...</div>
            ) : (
              <select
                value={formData.alumno_id}
                onChange={(e) => setFormData({ ...formData, alumno_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar alumno...</option>
                {alumnos.map(alumno => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.matricula} - {alumno.nombre} {alumno.apellidos}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periodo *
            </label>
            <select
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Parcial 1">Parcial 1</option>
              <option value="Parcial 2">Parcial 2</option>
              <option value="Parcial 3">Parcial 3</option>
              <option value="Final">Final</option>
            </select>
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
              placeholder="85.5"
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
            disabled={loading || loadingAlumnos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
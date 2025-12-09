// src/components/controlEscolar/FiltrosCalificaciones.tsx
import React, { useState } from 'react';
import { CalificacionesFiltros } from '../../types';

interface FiltrosCalificacionesProps {
  onFiltrar: (filtros: CalificacionesFiltros) => void;
  onLimpiar: () => void;
}

export const FiltrosCalificaciones: React.FC<FiltrosCalificacionesProps> = ({
  onFiltrar,
  onLimpiar,
}) => {
  const [filtros, setFiltros] = useState<CalificacionesFiltros>({
    periodo: '',
    incluirEliminadas: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFiltros((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value === '' ? undefined : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltrar(filtros);
  };

  const handleLimpiar = () => {
    setFiltros({
      periodo: '',
      incluirEliminadas: false,
    });
    onLimpiar();
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔍 Filtros de Búsqueda
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por Periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periodo
            </label>
            <select
              name="periodo"
              value={filtros.periodo || ''}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Todos los periodos</option>
              <option value="Primer Parcial">Primer Parcial</option>
              <option value="Segundo Parcial">Segundo Parcial</option>
              <option value="Tercer Parcial">Tercer Parcial</option>
              <option value="Final">Final</option>
            </select>
          </div>

          {/* ID de Asignación (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Asignación (opcional)
            </label>
            <input
              type="number"
              name="asignacion_id"
              value={filtros.asignacion_id || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: 1"
            />
          </div>

          {/* ID de Alumno (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Alumno (opcional)
            </label>
            <input
              type="number"
              name="alumno_id"
              value={filtros.alumno_id || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: 5"
            />
          </div>
        </div>

        {/* Checkbox incluir eliminadas */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="incluirEliminadas"
            name="incluirEliminadas"
            checked={filtros.incluirEliminadas || false}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="incluirEliminadas" className="text-sm text-gray-700">
            Incluir calificaciones eliminadas
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            🔍 Aplicar Filtros
          </button>
          <button
            type="button"
            onClick={handleLimpiar}
            className="btn-secondary"
          >
            🔄 Limpiar Filtros
          </button>
        </div>
      </form>
    </div>
  );
};
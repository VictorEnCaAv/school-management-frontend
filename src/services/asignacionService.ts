// src/services/asignacionService.ts
import api from './api';

export interface Asignacion {
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

export const asignacionService = {
  async obtenerMisAsignaciones(): Promise<Asignacion[]> {
    const response = await api.get('/maestro/asignaciones');
    return response.data;
  },

  async obtenerAlumnosPorAsignacion(asignacionId: number) {
    const response = await api.get(`/maestro/asignaciones/${asignacionId}/alumnos`);
    return response.data;
  }
};
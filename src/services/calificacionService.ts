// src/services/calificacionService.ts (ACTUALIZADO)
import api from './api';

export interface CalificacionInput {
  asignacion_id: number;
  alumno_id: number;
  nota: number;
  periodo: string;
  observaciones?: string;
}

export interface Calificacion {
  id: number;
  asignacion_id: number;
  alumno_id: number;
  nota: number;
  periodo: string;
  fecha_evaluacion: string;
  observaciones?: string;
  modificada_por?: number;
  fecha_modificacion?: string;
  created_at: string;
  updated_at: string;
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
  alumno: {
    id: number;
    matricula: string;
    nombre: string;
    apellidos: string;
  };
  modificador?: {
    nombre: string;
    apellidos: string;
  };
}

export const calificacionService = {
  // Maestro
  async obtenerMisCalificaciones(filtros?: { asignacion_id?: number; periodo?: string }): Promise<Calificacion[]> {
    const params = new URLSearchParams(filtros as any);
    const response = await api.get(`/maestro/calificaciones?${params}`);
    return response.data;
  },

  async registrarCalificacion(data: CalificacionInput): Promise<Calificacion> {
    const response = await api.post('/maestro/calificaciones', data);
    return response.data;
  },

  async actualizarCalificacion(id: number, data: { nota: number; observaciones?: string }): Promise<Calificacion> {
    const response = await api.put(`/maestro/calificaciones/${id}`, data);
    return response.data;
  },

  // Control Escolar
  async obtenerTodasLasCalificaciones(filtros?: {
    maestro_id?: number;
    materia_id?: number;
    grupo_id?: number;
    periodo?: string;
  }): Promise<Calificacion[]> {
    const params = new URLSearchParams(filtros as any);
    const response = await api.get(`/controlescolar/calificaciones?${params}`);
    return response.data;
  },

  async modificarCalificacion(id: number, data: { nota: number; observaciones?: string }): Promise<Calificacion> {
    const response = await api.put(`/controlescolar/calificaciones/${id}`, data);
    return response.data;
  },

  async eliminarCalificacion(id: number): Promise<void> {
    await api.delete(`/controlescolar/calificaciones/${id}`);
  }
};
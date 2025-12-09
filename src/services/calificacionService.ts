// src/services/calificacionService.ts
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
  
  // Campos para soft delete
  deleted_at?: string;
  deleted_by?: number;
  delete_reason?: string;
  
  asignacion: {
    id: number;
    materia: {
      id: number;
      nombre: string;
      codigo: string;
    };
    grupo: {
      id: number;
      nombre: string;
      codigo: string;
    };
    maestro?: {
      id: number;
      nombre: string;
      apellidos: string;
      email: string;
    };
  };
  alumno: {
    id: number;
    matricula: string;
    nombre: string;
    apellidos: string;
  };
  modificador?: {
    id: number;
    nombre: string;
    apellidos: string;
  };
  eliminadoPor?: {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  paginacion: {
    total: number;
    pagina: number;
    totalPaginas: number;
    limite: number;
  };
}

export interface CalificacionesFiltros {
  pagina?: number;
  limite?: number;
  asignacion_id?: number;
  alumno_id?: number;
  periodo?: string;
  maestro_id?: number;
  materia_id?: number;
  grupo_id?: number;
  incluirEliminadas?: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export const calificacionService = {
  // ========== MAESTRO ==========
  async obtenerMisCalificaciones(filtros?: { 
    asignacion_id?: number; 
    periodo?: string 
  }): Promise<Calificacion[]> {
    const params = new URLSearchParams();
    if (filtros?.asignacion_id) {
      params.append('asignacion_id', filtros.asignacion_id.toString());
    }
    if (filtros?.periodo) {
      params.append('periodo', filtros.periodo);
    }
    
    const response = await api.get(`/maestro/calificaciones?${params.toString()}`);
    return response.data.data || response.data;
  },

  async registrarCalificacion(data: CalificacionInput): Promise<Calificacion> {
    const response = await api.post('/maestro/calificaciones', data);
    return response.data.data || response.data;
  },

  async actualizarCalificacion(id: number, data: { 
    nota: number; 
    observaciones?: string 
  }): Promise<Calificacion> {
    const response = await api.put(`/maestro/calificaciones/${id}`, data);
    return response.data.data || response.data;
  },

  // ========== CONTROL ESCOLAR (Compatibilidad) ==========
  async obtenerTodasLasCalificaciones(filtros?: CalificacionesFiltros): Promise<PaginatedResponse<Calificacion>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/controlescolar/calificaciones?${params.toString()}`);
    return response.data;
  },

  async obtenerCalificacion(id: number): Promise<{ success: boolean; data: Calificacion }> {
    const response = await api.get(`/controlescolar/calificaciones/${id}`);
    return response.data;
  },

  async eliminarCalificacion(id: number, motivo?: string): Promise<{ success: boolean; message: string; data: any }> {
    const response = await api.delete(`/controlescolar/calificaciones/${id}`, { 
      data: { motivo } 
    });
    return response.data;
  },

  async restaurarCalificacion(id: number): Promise<{ success: boolean; message: string; data: any }> {
    const response = await api.post(`/controlescolar/calificaciones/${id}/restaurar`);
    return response.data;
  }
};
// src/services/controlEscolarService.ts
import api from './api';
import { Calificacion, CalificacionesFiltros, PaginatedResponse } from './calificacionService';

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: 'CONTROL_ESCOLAR' | 'MAESTRO' | 'ALUMNO';
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Materia {
  id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  activo: boolean;
}

export interface Grupo {
  id: number;
  codigo: string;
  nombre: string;
  ciclo_escolar: string;
  nivel: string;
  grado: string;
  grupo: string;
  activo: boolean;
}

export interface AsignacionCompleta {
  id: number;
  maestro_id: number;
  materia_id: number;
  grupo_id: number;
  ciclo_escolar: string;
  activo: boolean;
  materia: Materia;
  grupo: Grupo;
  maestro: Usuario;
}

export interface EstadisticasCalificaciones {
  total: number;
  activas: number;
  eliminadas: number;
  promedio_general: number;
  por_periodo: {
    periodo: string;
    cantidad: number;
    promedio: number;
  }[];
  por_materia: {
    materia_id: number;
    materia_nombre: string;
    cantidad: number;
    promedio: number;
  }[];
}

export const controlEscolarService = {
  // ========== GESTIÓN DE CALIFICACIONES ==========
  async obtenerCalificaciones(filtros?: CalificacionesFiltros): Promise<PaginatedResponse<Calificacion>> {
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

  async obtenerCalificacionDetalle(id: number): Promise<{ success: boolean; data: Calificacion }> {
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
  },

  async obtenerEstadisticasCalificaciones(): Promise<{ success: boolean; data: EstadisticasCalificaciones }> {
    const response = await api.get('/controlescolar/estadisticas/calificaciones');
    return response.data;
  },

  // ========== GESTIÓN DE ASIGNACIONES (Control Escolar) ==========
  async obtenerTodasAsignaciones(filtros?: {
    maestro_id?: number;
    materia_id?: number;
    grupo_id?: number;
    ciclo_escolar?: string;
    activo?: boolean;
    pagina?: number;
    limite?: number;
  }): Promise<PaginatedResponse<AsignacionCompleta>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get('/controlescolar/asignaciones', { params });
    return response.data;
  },

  async crearAsignacion(data: {
    maestro_id: number;
    materia_id: number;
    grupo_id: number;
    ciclo_escolar: string;
  }): Promise<{ success: boolean; data: AsignacionCompleta }> {
    const response = await api.post('/controlescolar/asignaciones', data);
    return response.data;
  },

  async actualizarAsignacion(id: number, data: Partial<{
    maestro_id: number;
    materia_id: number;
    grupo_id: number;
    ciclo_escolar: string;
    activo: boolean;
  }>): Promise<{ success: boolean; data: AsignacionCompleta }> {
    const response = await api.put(`/controlescolar/asignaciones/${id}`, data);
    return response.data;
  },

  async eliminarAsignacion(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/controlescolar/asignaciones/${id}`);
    return response.data;
  },

  // ========== GESTIÓN DE USUARIOS ==========
  async obtenerUsuarios(filtros?: {
    rol?: string;
    activo?: boolean;
    search?: string;
    pagina?: number;
    limite?: number;
  }): Promise<PaginatedResponse<Usuario>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get('/controlescolar/usuarios', { params });
    return response.data;
  },

  async crearUsuario(data: {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    rol: string;
    activo?: boolean;
  }): Promise<{ success: boolean; data: Usuario }> {
    const response = await api.post('/controlescolar/usuarios', data);
    return response.data;
  },

  async actualizarUsuario(id: number, data: Partial<{
    nombre: string;
    apellidos: string;
    email: string;
    rol: string;
    activo: boolean;
  }>): Promise<{ success: boolean; data: Usuario }> {
    const response = await api.put(`/controlescolar/usuarios/${id}`, data);
    return response.data;
  },

  async resetearPassword(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/controlescolar/usuarios/${id}/reset-password`);
    return response.data;
  }
};
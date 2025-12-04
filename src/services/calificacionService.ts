import api from './api';
import { Calificacion, CalificacionForm, ApiResponse, PaginatedResponse } from '@/types';

interface FiltrosCalificacion {
  materia_id?: number;
  alumno_id?: number;
  periodo?: string;
  ciclo_escolar?: string;
  page?: number;
  limit?: number;
}

export const calificacionService = {
  /**
   * Obtener todas las calificaciones con filtros
   */
  async obtenerCalificaciones(filtros?: FiltrosCalificacion): Promise<PaginatedResponse<Calificacion>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<Calificacion>>(
      `/calificaciones?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtener una calificación por ID
   */
  async obtenerCalificacionPorId(id: number): Promise<ApiResponse<Calificacion>> {
    const response = await api.get<ApiResponse<Calificacion>>(`/calificaciones/${id}`);
    return response.data;
  },

  /**
   * Crear nueva calificación
   */
  async crearCalificacion(data: CalificacionForm): Promise<ApiResponse<Calificacion>> {
    const response = await api.post<ApiResponse<Calificacion>>('/calificaciones', data);
    return response.data;
  },

  /**
   * Actualizar calificación
   */
  async actualizarCalificacion(
    id: number,
    data: Partial<CalificacionForm>
  ): Promise<ApiResponse<Calificacion>> {
    const response = await api.put<ApiResponse<Calificacion>>(`/calificaciones/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar calificación
   */
  async eliminarCalificacion(id: number): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/calificaciones/${id}`);
    return response.data;
  }
};
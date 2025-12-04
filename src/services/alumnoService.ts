
import api from './api.ts';
import type { Alumno, ApiResponse, PaginatedResponse } from '../types';

interface FiltrosAlumno {
  grupo?: string;
  matricula?: string;
  page?: number;
  limit?: number;
}

export const alumnoService = {
  /**
   * Obtener alumnos asignados al maestro autenticado
   */
  async obtenerAlumnosAsignados(filtros?: FiltrosAlumno): Promise<PaginatedResponse<Alumno>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<Alumno>>(
      `/maestro/alumnos?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtener un alumno por ID
   */
  async obtenerAlumnoPorId(id: number): Promise<ApiResponse<Alumno>> {
    const response = await api.get<ApiResponse<Alumno>>(`/maestro/alumnos/${id}`);
    return response.data;
  },

  /**
   * Buscar alumnos por matrícula o nombre
   */
  async buscarAlumnos(termino: string): Promise<ApiResponse<Alumno[]>> {
    const response = await api.get<ApiResponse<Alumno[]>>(
      `/maestro/alumnos/buscar?q=${encodeURIComponent(termino)}`
    );
    return response.data;
  }
};
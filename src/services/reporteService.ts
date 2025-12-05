import api from './api';
import type { ApiResponse, ReportePromedios, ReporteAlumno } from '../types/';

interface FiltrosReporte {
  alumno_id?: number;
  materia_id?: number;
  grupo?: string;
}

export const reporteService = {
  /**
   * Obtener reporte global de promedios (Control Escolar)
   */
  async obtenerReporteGlobal(filtros?: FiltrosReporte): Promise<ApiResponse<ReportePromedios>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get<ApiResponse<ReportePromedios>>(
      `/controlescolar/reporte?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtener reporte por alumno
   */
  async obtenerReportePorAlumno(alumnoId: number): Promise<ApiResponse<ReporteAlumno>> {
    const response = await api.get<ApiResponse<ReporteAlumno>>(
      `/controlescolar/reporte?alumno_id=${alumnoId}`
    );
    return response.data;
  },

  /**
   * Obtener reporte por materia
   */
  async obtenerReportePorMateria(materiaId: number): Promise<ApiResponse<ReportePromedios>> {
    const response = await api.get<ApiResponse<ReportePromedios>>(
      `/controlescolar/reporte?materia_id=${materiaId}`
    );
    return response.data;
  }
};
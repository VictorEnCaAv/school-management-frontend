// src/types/index.ts

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
  deleted_at?: string | null;
  deleted_by?: number;
  delete_reason?: string;
  
  asignacion?: {
    id: number;
    materia?: {
      id: number;
      nombre: string;
      codigo: string;
    };
    grupo?: {
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
  alumno?: {
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

// ✅ TIPO ACTUALIZADO - Incluye el campo "success"
export interface PaginatedResponse<T> {
  success: boolean;  // ⬅️ AGREGADO
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

export interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  email: string;
  rol: 'MAESTRO' | 'CONTROL_ESCOLAR';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    usuario: Usuario;
  };
}
// Usuario y Autenticación (según schema SQL)
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'MAESTRO' | 'CONTROL_ESCOLAR';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    usuario: Usuario;
  };
}

// Alumno (según schema SQL)
export interface Alumno {
  id: number;
  nombre: string;
  matricula: string;
  fecha_nacimiento?: string;
  grupo: string;
  created_at: string;
  updated_at: string;
}

// Materia (según schema SQL)
export interface Materia {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

// Calificación (según schema SQL - tabla asociativa)
export interface Calificacion {
  id: number;
  alumno_id: number;
  materia_id: number;
  maestro_id: number;
  nota: number;
  fecha_registro: string;
  observaciones?: string;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  // Relaciones opcionales cuando se incluyen en la respuesta
  alumno?: Alumno;
  materia?: Materia;
  maestro?: Usuario;
}

export interface CalificacionForm {
  alumno_id: number;
  materia_id: number;
  nota: number;
  observaciones?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// Reportes
export interface EstadisticasMateria {
  promedio: string;
  maxima: string;
  minima: string;
  total: number;
  aprobados: number;
  reprobados: number;
  porcentaje_aprobacion: string;
}

export interface ReporteAlumno {
  alumno: Alumno;
  estadisticas: {
    promedio_general: string;
    total_calificaciones: number;
    materias_aprobadas: number;
    materias_reprobadas: number;
  };
  calificaciones: Calificacion[];
}

export interface ReporteGeneral {
  ciclo_escolar: string;
  resumen: {
    total_alumnos: number;
    total_maestros: number;
    total_materias: number;
    total_calificaciones: number;
    promedio_general: string;
  };
  distribucion_por_grado: Array<{
    grado: number;
    total: number;
  }>;
}
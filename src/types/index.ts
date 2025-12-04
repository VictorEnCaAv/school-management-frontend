// Usuario y Autenticación
export interface Usuario {
  id: number;
  email: string;
  rol: 'admin' | 'maestro';
  activo: boolean;
  maestro?: Maestro;
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

// Maestro
export interface Maestro {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  cedula_profesional?: string;
  especialidad?: string;
  telefono?: string;
  usuario_id: number;
  created_at: string;
  updated_at: string;
}

// Alumno
export interface Alumno {
  id: number;
  matricula: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento?: string;
  grado: number;
  grupo: string;
  email?: string;
  telefono?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Materia
export interface Materia {
  id: number;
  nombre: string;
  clave: string;
  descripcion?: string;
  grado: number;
  creditos: number;
  maestro_id?: number;
  maestro?: Maestro;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Calificación
export interface Calificacion {
  id: number;
  alumno_id: number;
  materia_id: number;
  periodo: '1' | '2' | '3' | 'extraordinario' | 'final';
  calificacion: number;
  observaciones?: string;
  ciclo_escolar: string;
  alumno?: Alumno;
  materia?: Materia;
  created_at: string;
  updated_at: string;
}

export interface CalificacionForm {
  alumno_id: number;
  materia_id: number;
  periodo: '1' | '2' | '3' | 'extraordinario' | 'final';
  calificacion: number;
  observaciones?: string;
  ciclo_escolar?: string;
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
    [key: string]: T[];
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
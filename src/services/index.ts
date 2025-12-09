// src/services/index.ts
export { authService } from './authService';
export { asignacionService } from './asignacionService';
export { calificacionService } from './calificacionService';
export { alumnoService } from './alumnoService';
export { reporteService } from './reporteService';
export { controlEscolarService } from './controlEscolarService';

// Re-exportar tipos importantes
export type { Calificacion, CalificacionInput, CalificacionesFiltros } from './calificacionService';
export type { Asignacion, Alumno } from './asignacionService';
export type { Usuario, Materia, Grupo, AsignacionCompleta, EstadisticasCalificaciones } from './controlEscolarService';
// src/services/authService.ts (COMPLETO)
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: 'CONTROL_ESCOLAR' | 'MAESTRO' | 'ALUMNO' | 'ADMIN';
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    usuario: Usuario;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
  };
}

export const authService = {
  /**
   * Login de usuario
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  },

  /**
   * Logout de usuario
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('refreshToken');
    // Opcional: Redirigir a login
    window.location.href = '/login';
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async obtenerPerfil(): Promise<ApiResponse<Usuario>> {
    try {
      const response = await api.get<ApiResponse<Usuario>>('/auth/perfil');
      if (response.data.success && response.data.data) {
        // Actualizar usuario en localStorage si es necesario
        localStorage.setItem('usuario', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener perfil:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener perfil'
      };
    }
  },

  /**
   * Refrescar token
   */
  async refrescarToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken
      });
      
      if (response.data.success && response.data.data) {
        localStorage.setItem('token', response.data.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error al refrescar token:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al refrescar token'
      };
    }
  },

  /**
   * Obtener usuario desde localStorage
   */
  obtenerUsuarioLocal(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return null;
    
    try {
      const usuario = JSON.parse(usuarioStr);
      // Validar que tenga la estructura básica de Usuario
      if (usuario && typeof usuario === 'object' && usuario.id && usuario.rol) {
        return usuario as Usuario;
      }
      return null;
    } catch (error) {
      console.error('Error al parsear usuario de localStorage:', error);
      return null;
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  estaAutenticado(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Opcional: Verificar expiración del token JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiraEn = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() < expiraEn;
    } catch {
      // Si hay error al decodificar, asumimos que el token es inválido
      return false;
    }
  },

  /**
   * Obtener token
   */
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Verificar si el usuario tiene un rol específico
   */
  tieneRol(rolRequerido: Usuario['rol'] | Usuario['rol'][]): boolean {
    const usuario = this.obtenerUsuarioLocal();
    if (!usuario) return false;
    
    if (Array.isArray(rolRequerido)) {
      return rolRequerido.includes(usuario.rol);
    }
    
    return usuario.rol === rolRequerido;
  },

  /**
   * Verificar si el usuario es Control Escolar
   */
  esControlEscolar(): boolean {
    return this.tieneRol('CONTROL_ESCOLAR');
  },

  /**
   * Verificar si el usuario es Maestro
   */
  esMaestro(): boolean {
    return this.tieneRol('MAESTRO');
  },

  /**
   * Verificar si el usuario es Alumno
   */
  esAlumno(): boolean {
    return this.tieneRol('ALUMNO');
  },

  /**
   * Verificar si el usuario es Admin
   */
  esAdmin(): boolean {
    return this.tieneRol('ADMIN');
  },

  /**
   * Actualizar datos del usuario en localStorage
   */
  actualizarUsuarioLocal(usuario: Partial<Usuario>): void {
    const usuarioActual = this.obtenerUsuarioLocal();
    if (usuarioActual) {
      const usuarioActualizado = { ...usuarioActual, ...usuario };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }
  },

  /**
   * Cambiar contraseña
   */
  async cambiarPassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/cambiar-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cambiar contraseña'
      };
    }
  },

  /**
   * Solicitar restablecimiento de contraseña
   */
  async solicitarResetPassword(email: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/solicitar-reset-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Error al solicitar restablecimiento:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al solicitar restablecimiento de contraseña'
      };
    }
  },

  /**
   * Restablecer contraseña con token
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al restablecer contraseña'
      };
    }
  },

  /**
   * Verificar token de restablecimiento
   */
  async verificarTokenReset(token: string): Promise<ApiResponse<{ email: string }>> {
    try {
      const response = await api.get<ApiResponse<{ email: string }>>(`/auth/verificar-token-reset/${token}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al verificar token:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Token inválido o expirado'
      };
    }
  },

  /**
   * Obtener headers de autenticación
   */
  getAuthHeaders(): { Authorization: string } | {} {
    const token = this.obtenerToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`
      };
    }
    return {};
  }
};
import api from './api';
import type { LoginCredentials, LoginResponse, Usuario, ApiResponse } from '../types/index';

export const authService = {
  /**
   * Login de usuario
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    if (response.data.success && response.data.data) {
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    
    return response.data;
  },

  /**
   * Logout de usuario
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async obtenerPerfil(): Promise<ApiResponse<Usuario>> {
    const response = await api.get<ApiResponse<Usuario>>('/auth/perfil');
    return response.data;
  },

  /**
   * Refrescar token
   */
  async refrescarToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
    
    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data;
  },

  /**
   * Obtener usuario desde localStorage
   */
  obtenerUsuarioLocal(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener token
   */
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
};
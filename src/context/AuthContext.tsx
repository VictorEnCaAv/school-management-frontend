import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { Usuario, LoginCredentials } from '../types/index';

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isMaestro: boolean;
  isControlEscolar: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const usuarioLocal = authService.obtenerUsuarioLocal();
        if (usuarioLocal && authService.estaAutenticado()) {
          setUsuario(usuarioLocal);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setUsuario(response.data.usuario);
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const value: AuthContextType = {
    usuario,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario && authService.estaAutenticado(),
    isMaestro: usuario?.rol === 'MAESTRO',
    isControlEscolar: usuario?.rol === 'CONTROL_ESCOLAR',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
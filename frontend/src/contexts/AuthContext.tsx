import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const verifyToken = async (token: string) => {
    try {
      console.log('Verifying token...');
      const response = await axios.get('http://localhost:3001/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Token verification response:', response.data);
      const isSuperAdmin = response.data.role === 'superadmin';
      setIsAdmin(isSuperAdmin);
      console.log('Is super admin:', isSuperAdmin);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  const login = async (tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    const isValid = await verifyToken(tokens.accessToken);
    setIsAuthenticated(isValid);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const isValid = await verifyToken(token);
        setIsAuthenticated(isValid);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
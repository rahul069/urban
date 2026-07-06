import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../api/apiClient';
import apiClient from '../api/apiClient';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: any;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth(apiClient);

  const value = useMemo(() => ({
    ...auth,
    login: auth.login,
    logout: auth.logout,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
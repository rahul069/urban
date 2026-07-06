import React, { createContext, useContext, useMemo } from 'react';

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
  const { login } = apiClient;
  const logout = async () => localStorage.removeItem('token');


  const value = useMemo(() => ({
    login,
    logout,
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
  }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
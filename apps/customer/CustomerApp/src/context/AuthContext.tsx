import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../api/apiClient';
import apiClient from '../api/apiClient';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: any;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (credentials: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isProvider: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth(apiClient);

  const value = useMemo(() => ({
    ...auth,
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
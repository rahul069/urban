import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginSuccess, logout } from '../features/auth/authSlice';
import UrbanApiClient from '@urban/api-client';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => void;
  getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [apiClient] = useState(new UrbanApiClient(process.env.API_BASE_URL || 'http://localhost:3000/api'));

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.accessToken,
      }));
      apiClient.setAuth(response.data.accessToken);
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (credentials: any) => {
    try {
      const response = await apiClient.register(credentials);
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.accessToken,
      }));
      apiClient.setAuth(response.data.accessToken);
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    apiClient.clearAuth();
  };

  const getAuthToken = () => {
    return token || null;
  };

  // Set auth token when it changes
  useEffect(() => {
    if (token) {
      apiClient.setAuth(token);
    }
  }, [token, apiClient]);

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        token,
        login,
        register,
        logout: handleLogout,
        getAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
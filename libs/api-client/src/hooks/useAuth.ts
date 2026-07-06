import { useState, useEffect, useCallback } from 'react';
import UrbanApiClient, { LoginCredentials, RegisterCredentials, AuthResponse, ApiError } from '../index';

export const useAuth = (apiClient: UrbanApiClient) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getAuthToken();
      if (token) {
        // In a real app, you would verify the token with the backend
        // For now, just set a mock user
        setUser({
          id: 'mock-user-id',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          userType: 'customer',
        });
      }
    };
    checkAuth();
  }, [apiClient]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(credentials);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(credentials);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.logout();
      setUser(null);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isCustomer: user?.userType === 'customer',
    isProvider: user?.userType === 'provider',
  };
};
import { useState, useCallback } from 'react';
import UrbanApiClient, { Provider, ApiError } from '../index';

export const useProviders = (apiClient: UrbanApiClient) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getProviders = useCallback(async (params: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    serviceType?: string;
  } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProviders(params);
      setProviders(response.data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getProviderById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProviderById(id);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const uploadProviderDocument = useCallback(async (
    providerId: string,
    documentType: 'meisterbrief' | 'idCard' | 'insurance' | 'bankStatement',
    file: File | Blob,
    metadata?: any
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.uploadProviderDocument(
        providerId,
        documentType,
        file,
        metadata
      );
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getProviderVerificationStatus = useCallback(async (providerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProviderVerificationStatus(providerId);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  return {
    providers,
    loading,
    error,
    getProviders,
    getProviderById,
    uploadProviderDocument,
    getProviderVerificationStatus,
  };
};
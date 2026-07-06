import { useState, useCallback } from 'react';
import UrbanApiClient, { Invoice, ApiError } from '../index';

export const useInvoices = (apiClient: UrbanApiClient) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getInvoiceById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getInvoiceById(id);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const generateInvoicePdf = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.generateInvoicePdf(invoiceId);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const generateInvoiceXml = useCallback(async (invoiceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.generateInvoiceXml(invoiceId);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getInvoicesByBooking = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getInvoicesByBooking(bookingId);
      setInvoices(response.data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getInvoicesByCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getInvoicesByCustomer(customerId);
      setInvoices(response.data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getInvoicesByProvider = useCallback(async (providerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getInvoicesByProvider(providerId);
      setInvoices(response.data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  return {
    invoices,
    loading,
    error,
    getInvoiceById,
    generateInvoicePdf,
    generateInvoiceXml,
    getInvoicesByBooking,
    getInvoicesByCustomer,
    getInvoicesByProvider,
  };
};
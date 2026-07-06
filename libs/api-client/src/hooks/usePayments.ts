import { useState, useCallback } from 'react';
import UrbanApiClient, { Payment, ApiError } from '../index';

export const usePayments = (apiClient: UrbanApiClient) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createPayment = useCallback(async (paymentData: {
    bookingId: string;
    amount: number;
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
    paymentMethodId?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createPayment(paymentData);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getPaymentById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPaymentById(id);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getPaymentsByBooking = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPaymentsByBooking(bookingId);
      setPayments(response.data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  return {
    payments,
    loading,
    error,
    createPayment,
    getPaymentById,
    getPaymentsByBooking,
  };
};
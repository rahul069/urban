import { useState, useCallback } from 'react';
import UrbanApiClient, { Booking, ApiError } from '../index';

export const useBookings = (apiClient: UrbanApiClient) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.createBooking(bookingData);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getBookingById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBookingById(id);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const updateBookingStatus = useCallback(async (id: string, status: Booking['status']) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateBookingStatus(id, status);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getBookingsByCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBookingsByCustomer(customerId);
      setBookings(response.data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const getBookingsByProvider = useCallback(async (providerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBookingsByProvider(providerId);
      setBookings(response.data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    getBookingById,
    updateBookingStatus,
    getBookingsByCustomer,
    getBookingsByProvider,
  };
};
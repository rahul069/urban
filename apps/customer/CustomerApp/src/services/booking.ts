"use strict";
import api from './api';

export const requestBooking = async (
  providerId: string,
  serviceId: string,
  scheduledAt: string,
  notes?: string
) => {
  return api.post('/bookings', { providerId, serviceId, scheduledAt, notes });
};

export const getBookings = async (status?: string) => {
  return api.get('/bookings', { params: { status } });
};

export const getBookingDetails = async (bookingId: string) => {
  return api.get(`/bookings/${bookingId}`);
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'in_progress' | 'completed' | 'cancelled'
) => {
  return api.patch(`/bookings/${bookingId}/status`, { status });
};
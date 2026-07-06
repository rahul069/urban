"use strict";
import api from './api';

export const getJobRequests = async (status?: string) => {
  return api.get('/bookings/provider', { params: { status } });
};

export const respondToBooking = async (
  bookingId: string,
  response: 'accepted' | 'declined'
) => {
  return api.post(`/bookings/${bookingId}/response`, { response });
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'in_progress' | 'completed'
) => {
  return api.patch(`/bookings/${bookingId}/status`, { status });
};

export const getBookingDetails = async (bookingId: string) => {
  return api.get(`/bookings/${bookingId}`);
};
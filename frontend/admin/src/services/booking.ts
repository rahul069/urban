"use strict";
import api from './api';

export const getBookings = async (status?: string) => {
  return api.get('/bookings', { params: { status } });
};

export const getBookingDetails = async (bookingId: string) => {
  return api.get(`/bookings/${bookingId}`);
};
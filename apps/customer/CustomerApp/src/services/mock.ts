"use strict";
import { rest } from 'msw';
import { setupWorker } from 'msw/native';

const mockBookings = [
  {
    id: '1',
    providerId: 'provider-1',
    serviceId: 'service-1',
    customerId: 'customer-1',
    status: 'confirmed',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    notes: 'Please arrive on time',
    createdAt: new Date().toISOString(),
  },
];

const mockAuthResponse = {
  token: 'mock-token',
  role: 'customer',
};

export const mockHandlers = [
  rest.post(`${process.env.API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(ctx.json(mockAuthResponse));
  }),
  rest.post(`${process.env.API_BASE_URL}/auth/register`, (req, res, ctx) => {
    return res(ctx.json(mockAuthResponse));
  }),
  rest.get(`${process.env.API_BASE_URL}/bookings`, (req, res, ctx) => {
    return res(ctx.json(mockBookings));
  }),
  rest.post(`${process.env.API_BASE_URL}/bookings`, (req, res, ctx) => {
    const newBooking = {
      ...req.body,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockBookings.push(newBooking);
    return res(ctx.json(newBooking));
  }),
  rest.get(`${process.env.API_BASE_URL}/bookings/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const booking = mockBookings.find((b) => b.id === id);
    return res(ctx.json(booking));
  }),
  rest.patch(`${process.env.API_BASE_URL}/bookings/:id/status`, (req, res, ctx) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = mockBookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
    }
    return res(ctx.json(booking));
  }),
];

export const mockWorker = setupWorker(...mockHandlers);
"use strict";
import { rest } from 'msw';
import { setupWorker } from 'msw';

const mockVerificationQueue = [
  {
    providerId: 'provider-1',
    name: 'John Doe',
    email: 'john@example.com',
    documents: [
      { type: 'id', url: 'mock-url', status: 'pending' },
      { type: 'insurance', url: 'mock-url', status: 'pending' },
    ],
    status: 'pending',
  },
];

const mockBookings = [
  {
    id: '1',
    providerId: 'provider-1',
    customerId: 'customer-1',
    serviceId: 'service-1',
    status: 'confirmed',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    notes: 'Please arrive on time',
    createdAt: new Date().toISOString(),
  },
];

export const mockHandlers = [
  rest.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verification/admin/queue`, (req, res, ctx) => {
    return res(ctx.json(mockVerificationQueue));
  }),
  rest.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verification/admin/review`, (req, res, ctx) => {
    const { providerId, status } = req.body;
    const request = mockVerificationQueue.find((req) => req.providerId === providerId);
    if (request) {
      request.status = status;
    }
    return res(ctx.json(request));
  }),
  rest.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, (req, res, ctx) => {
    return res(ctx.json(mockBookings));
  }),
  rest.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const booking = mockBookings.find((b) => b.id === id);
    return res(ctx.json(booking));
  }),
];

export const mockWorker = setupWorker(...mockHandlers);
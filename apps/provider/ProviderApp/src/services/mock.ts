"use strict";
import { rest } from 'msw';
import { setupWorker } from 'msw/native';

const mockJobs = [
  {
    id: '1',
    providerId: 'provider-1',
    serviceId: 'service-1',
    customerId: 'customer-1',
    status: 'pending',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    notes: 'Please confirm',
    createdAt: new Date().toISOString(),
  },
];

const mockAuthResponse = {
  token: 'mock-token',
  role: 'provider',
};

const mockVerificationStatus = {
  status: 'pending',
  documents: [
    { type: 'id', url: 'mock-url', status: 'pending' },
    { type: 'insurance', url: 'mock-url', status: 'pending' },
  ],
};

export const mockHandlers = [
  rest.post(`${process.env.API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(ctx.json(mockAuthResponse));
  }),
  rest.post(`${process.env.API_BASE_URL}/auth/register`, (req, res, ctx) => {
    return res(ctx.json(mockAuthResponse));
  }),
  rest.get(`${process.env.API_BASE_URL}/bookings/provider`, (req, res, ctx) => {
    return res(ctx.json(mockJobs));
  }),
  rest.post(`${process.env.API_BASE_URL}/bookings/:id/response`, (req, res, ctx) => {
    const { id } = req.params;
    const { response } = req.body;
    const job = mockJobs.find((j) => j.id === id);
    if (job) {
      job.status = response === 'accepted' ? 'accepted' : 'declined';
    }
    return res(ctx.json(job));
  }),
  rest.patch(`${process.env.API_BASE_URL}/bookings/:id/status`, (req, res, ctx) => {
    const { id } = req.params;
    const { status } = req.body;
    const job = mockJobs.find((j) => j.id === id);
    if (job) {
      job.status = status;
    }
    return res(ctx.json(job));
  }),
  rest.get(`${process.env.API_BASE_URL}/verification/status`, (req, res, ctx) => {
    return res(ctx.json(mockVerificationStatus));
  }),
  rest.post(`${process.env.API_BASE_URL}/verification/documents`, (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];

export const mockWorker = setupWorker(...mockHandlers);
"use strict";
import api from './api';

export const getVerificationQueue = async () => {
  return api.get('/providers/verification/pending');
};

export const reviewVerification = async (
  providerId: string,
  status: 'approved' | 'rejected' | 'expired',
  notes?: string
) => {
  return api.put(`/providers/${providerId}/verification`, { status, notes });
};

export const getVerificationHistory = async (providerId: string) => {
  return api.get(`/providers/${providerId}/verification/history`);
};

export const getExpiringVerifications = async (days: number = 30) => {
  return api.get('/providers/verification/expiring', { params: { days } });
};
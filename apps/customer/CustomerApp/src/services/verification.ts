"use strict";
import api from './api';
import { DocumentType } from '../types';

export const uploadDocument = async (
  documentType: DocumentType,
  file: File
) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('type', documentType);

  return api.post('/verification/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getVerificationStatus = async () => {
  return api.get('/verification/status');
};

export const getAdminVerificationQueue = async () => {
  return api.get('/verification/admin/queue');
};

export const reviewVerification = async (
  providerId: string,
  status: 'approved' | 'rejected',
  notes?: string
) => {
  return api.post('/verification/admin/review', { providerId, status, notes });
};
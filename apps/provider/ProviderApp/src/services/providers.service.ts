"use strict";
import api from './api';
import { DocumentType } from '../types';

export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  certificationNumber: string;
}

export interface Verification {
  id: string;
  providerId: string;
  documentType: DocumentType;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export const createProvider = async (providerData: Omit<Provider, 'id'>): Promise<Provider> => {
  return api.post('/providers', providerData);
};

export const getProviderByUserId = async (userId: string): Promise<Provider> => {
  return api.get(`/providers/user/${userId}`);
};

export const uploadDocument = async (
  providerId: string,
  documentType: DocumentType,
  file: File
): Promise<Verification> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  return api.post(`/providers/${providerId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getVerificationStatus = async (providerId: string): Promise<Verification> => {
  return api.get(`/providers/${providerId}/verification`);
};
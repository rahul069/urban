"use strict";
import api from './api';
import { DocumentType } from '../types';

export const uploadDocument = async (
  providerId: string,
  documentType: DocumentType,
  file: File
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  return api.post(`/providers/${providerId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getVerificationStatus = async (providerId: string) => {
  return api.get(`/providers/${providerId}/verification`);
};
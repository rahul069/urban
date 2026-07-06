import React, { createContext, useContext, useMemo } from 'react';
import UrbanApiClient from '@urban/api-client';
import { useAuthContext } from './AuthContext';

interface ApiContextType {
  apiClient: UrbanApiClient;
  providers: {
    getProviders: (params?: any) => Promise<any>;
    getProviderById: (id: string) => Promise<any>;
    uploadProviderDocument: (
      providerId: string,
      documentType: 'meisterbrief' | 'idCard' | 'insurance' | 'bankStatement',
      file: any,
      metadata?: any
    ) => Promise<any>;
    getProviderVerificationStatus: (providerId: string) => Promise<any>;
  };
  bookings: {
    createBooking: (bookingData: any) => Promise<any>;
    getBookingById: (id: string) => Promise<any>;
    updateBookingStatus: (id: string, status: string) => Promise<any>;
    getBookingsByProvider: (providerId: string) => Promise<any>;
  };
  payments: {
    createPayment: (paymentData: any) => Promise<any>;
    getPaymentById: (id: string) => Promise<any>;
    getPaymentsByBooking: (bookingId: string) => Promise<any>;
  };
  invoices: {
    getInvoiceById: (id: string) => Promise<any>;
    generateInvoicePdf: (invoiceId: string) => Promise<any>;
    getInvoicesByProvider: (providerId: string) => Promise<any>;
  };
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getAuthToken } = useAuthContext();

  const apiClient = useMemo(() => {
    const client = new UrbanApiClient(process.env.API_BASE_URL || 'http://localhost:3000/api');
    
    // Set the auth token if available
    const token = getAuthToken();
    if (token) {
      client.setAuth(token);
    }
    
    return client;
  }, [getAuthToken]);

  const value = useMemo(() => ({
    apiClient,
    providers: {
      getProviders: (params) => apiClient.getProviders(params),
      getProviderById: (id) => apiClient.getProviderById(id),
      uploadProviderDocument: (providerId, documentType, file, metadata) => 
        apiClient.uploadProviderDocument(providerId, documentType, file, metadata),
      getProviderVerificationStatus: (providerId) => 
        apiClient.getProviderVerificationStatus(providerId),
    },
    bookings: {
      createBooking: (bookingData) => apiClient.createBooking(bookingData),
      getBookingById: (id) => apiClient.getBookingById(id),
      updateBookingStatus: (id, status) => apiClient.updateBookingStatus(id, status),
      getBookingsByProvider: (providerId) => apiClient.getBookingsByProvider(providerId),
    },
    payments: {
      createPayment: (paymentData) => apiClient.createPayment(paymentData),
      getPaymentById: (id) => apiClient.getPaymentById(id),
      getPaymentsByBooking: (bookingId) => apiClient.getPaymentsByBooking(bookingId),
    },
    invoices: {
      getInvoiceById: (id) => apiClient.getInvoiceById(id),
      generateInvoicePdf: (invoiceId) => apiClient.generateInvoicePdf(invoiceId),
      getInvoicesByProvider: (providerId) => apiClient.getInvoicesByProvider(providerId),
    },
  }), [apiClient]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
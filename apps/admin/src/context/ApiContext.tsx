import React, { createContext, useContext, useMemo } from 'react';
import apiClient from '../api/apiClient';
import { useProviders, useBookings, usePayments, useInvoices } from '../api/apiClient';

interface ApiContextType {
  apiClient: typeof apiClient;
  providers: ReturnType<typeof useProviders>;
  bookings: ReturnType<typeof useBookings>;
  payments: ReturnType<typeof usePayments>;
  invoices: ReturnType<typeof useInvoices>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const providers = useProviders(apiClient);
  const bookings = useBookings(apiClient);
  const payments = usePayments(apiClient);
  const invoices = useInvoices(apiClient);

  const value = useMemo(() => ({
    apiClient,
    providers,
    bookings,
    payments,
    invoices,
  }), [providers, bookings, payments, invoices]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
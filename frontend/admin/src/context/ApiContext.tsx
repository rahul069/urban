"use client";

import { createContext, useContext, ReactNode } from 'react';

// Mock API client
const mockApiClient = {
  login: async (credentials: { email: string; password: string }) => {
    console.log('Login:', credentials);
    return { data: { accessToken: 'mock-token' } };
  },
  getProviders: async () => {
    console.log('Fetching providers...');
    return { data: [] };
  },
  getBookings: async () => {
    console.log('Fetching bookings...');
    return { data: [] };
  },
};

const ApiContext = createContext({
  apiClient: mockApiClient,
  providers: {
    getProviders: mockApiClient.getProviders,
    getProviderById: async (id: string) => ({ data: {} }),
    updateProviderVerification: async (id: string, status: string) => ({ data: {} }),
  },
  bookings: {
    getBookings: mockApiClient.getBookings,
    getBookingById: async (id: string) => ({ data: {} }),
    updateBookingStatus: async (id: string, status: string) => ({ data: {} }),
  },
});

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ApiContext.Provider value={
      {
        apiClient: mockApiClient,
        providers: {
          getProviders: mockApiClient.getProviders,
          getProviderById: async (id: string) => ({ data: {} }),
          updateProviderVerification: async (id: string, status: string) => ({ data: {} }),
        },
        bookings: {
          getBookings: mockApiClient.getBookings,
          getBookingById: async (id: string) => ({ data: {} }),
          updateBookingStatus: async (id: string, status: string) => ({ data: {} }),
        },
      }
    }>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
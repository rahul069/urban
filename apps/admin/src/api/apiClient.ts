import UrbanApiClient from '@urban/api-client';

// Initialize the API client
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = new UrbanApiClient(API_BASE_URL);

export default apiClient;

export * from '@urban/api-client';
export { useAuth, useProviders, useBookings, usePayments, useInvoices } from '@urban/api-client';
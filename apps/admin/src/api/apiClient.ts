import simpleApiClient from './simpleApiClient';

export default simpleApiClient;

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    const response = await simpleApiClient.login({ email, password });
    localStorage.setItem('token', response.accessToken);
    return response;
  };
  
  const logout = () => {
    localStorage.removeItem('token');
  };
  
  return { login, logout };
};

export const useProviders = () => {
  return {
    getProviders: simpleApiClient.getProviders,
    getProviderById: simpleApiClient.getProviderById,
    updateProviderVerification: simpleApiClient.updateProviderVerification,
  };
};

export const useBookings = () => {
  return {
    getBookings: simpleApiClient.getBookings,
    getBookingById: simpleApiClient.getBookingById,
    updateBookingStatus: simpleApiClient.updateBookingStatus,
  };
};

export const useInvoices = () => {
  return {
    getInvoices: simpleApiClient.getInvoices,
    getInvoiceById: simpleApiClient.getInvoiceById,
    generateInvoicePdf: simpleApiClient.generateInvoicePdf,
  };
};
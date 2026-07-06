import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import {
  ApiResponse,
  ApiError,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  Provider,
  Booking,
  Payment,
  Invoice,
} from './types';
import { ApiErrorHandler } from './utils/errorHandler';

// API Client Class
class UrbanApiClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
    
    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Handle 401 Unauthorized
          if (error.response.status === 401) {
            this.clearAuth();
            // In a real app, you would redirect to login here
          }
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): ApiError {
    return ApiErrorHandler.handleError(error);
  }

  // Auth Methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.axiosInstance.post('/auth/login', credentials);
    this.setAuth(response.data.data.accessToken);
    return this.formatResponse(response);
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.axiosInstance.post('/auth/register', credentials);
    this.setAuth(response.data.data.accessToken);
    return this.formatResponse(response);
  }

  async logout(): Promise<void> {
    this.clearAuth();
    // In a real app, you would call the backend logout endpoint
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.axiosInstance.post('/auth/refresh', { refreshToken });
    this.setAuth(response.data.data.accessToken);
    return this.formatResponse(response);
  }

  // Provider Methods
  async getProviders(params: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    serviceType?: string;
  }): Promise<ApiResponse<Provider[]>> {
    const response = await this.axiosInstance.get('/providers', { params });
    return this.formatResponse(response);
  }

  async getProviderById(id: string): Promise<ApiResponse<Provider>> {
    const response = await this.axiosInstance.get(`/providers/${id}`);
    return this.formatResponse(response);
  }

  async uploadProviderDocument(
    providerId: string,
    documentType: 'meisterbrief' | 'idCard' | 'insurance' | 'bankStatement',
    file: File | Blob,
    metadata?: any
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('document', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    
    const response = await this.axiosInstance.post(
      `/providers/${providerId}/documents/${documentType}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return this.formatResponse(response);
  }

  async getProviderVerificationStatus(providerId: string): Promise<ApiResponse<any>> {
    const response = await this.axiosInstance.get(`/providers/${providerId}/verification`);
    return this.formatResponse(response);
  }

  // Booking Methods
  async createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Booking>> {
    const response = await this.axiosInstance.post('/bookings', bookingData);
    return this.formatResponse(response);
  }

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    const response = await this.axiosInstance.get(`/bookings/${id}`);
    return this.formatResponse(response);
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<ApiResponse<Booking>> {
    const response = await this.axiosInstance.patch(`/bookings/${id}/status`, { status });
    return this.formatResponse(response);
  }

  async getBookingsByCustomer(customerId: string): Promise<ApiResponse<Booking[]>> {
    const response = await this.axiosInstance.get(`/bookings/customer/${customerId}`);
    return this.formatResponse(response);
  }

  async getBookingsByProvider(providerId: string): Promise<ApiResponse<Booking[]>> {
    const response = await this.axiosInstance.get(`/bookings/provider/${providerId}`);
    return this.formatResponse(response);
  }

  // Payment Methods
  async createPayment(paymentData: {
    bookingId: string;
    amount: number;
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
    paymentMethodId?: string;
  }): Promise<ApiResponse<Payment>> {
    const response = await this.axiosInstance.post('/payments', paymentData);
    return this.formatResponse(response);
  }

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    const response = await this.axiosInstance.get(`/payments/${id}`);
    return this.formatResponse(response);
  }

  async getPaymentsByBooking(bookingId: string): Promise<ApiResponse<Payment[]>> {
    const response = await this.axiosInstance.get(`/payments/booking/${bookingId}`);
    return this.formatResponse(response);
  }

  // Invoice Methods
  async getInvoiceById(id: string): Promise<ApiResponse<Invoice>> {
    const response = await this.axiosInstance.get(`/invoices/${id}`);
    return this.formatResponse(response);
  }

  async generateInvoicePdf(invoiceId: string): Promise<ApiResponse<{ pdfUrl: string }>> {
    const response = await this.axiosInstance.post(`/invoices/${invoiceId}/generate-pdf`);
    return this.formatResponse(response);
  }

  async generateInvoiceXml(invoiceId: string): Promise<ApiResponse<{ xmlUrl: string }>> {
    const response = await this.axiosInstance.post(`/invoices/${invoiceId}/generate-xml`);
    return this.formatResponse(response);
  }

  async getInvoicesByBooking(bookingId: string): Promise<ApiResponse<Invoice[]>> {
    const response = await this.axiosInstance.get(`/invoices/booking/${bookingId}`);
    return this.formatResponse(response);
  }

  async getInvoicesByCustomer(customerId: string): Promise<ApiResponse<Invoice[]>> {
    const response = await this.axiosInstance.get(`/invoices/customer/${customerId}`);
    return this.formatResponse(response);
  }

  async getInvoicesByProvider(providerId: string): Promise<ApiResponse<Invoice[]>> {
    const response = await this.axiosInstance.get(`/invoices/provider/${providerId}`);
    return this.formatResponse(response);
  }

  // Utility Methods
  setAuth(token: string): void {
    this.accessToken = token;
    // Store token in secure storage (implementation depends on platform)
    if (Platform.OS === 'web') {
      localStorage.setItem('accessToken', token);
    } else {
      // For React Native, use AsyncStorage or SecureStore
    }
  }

  clearAuth(): void {
    this.accessToken = null;
    // Clear token from storage
    if (Platform.OS === 'web') {
      localStorage.removeItem('accessToken');
    } else {
      // For React Native
    }
  }

  getAuthToken(): string | null {
    if (this.accessToken) return this.accessToken;
    
    // Try to get from storage
    if (Platform.OS === 'web') {
      return localStorage.getItem('accessToken');
    } else {
      // For React Native
      return null;
    }
  }

  private formatResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }
}

export default UrbanApiClient;

export * from './types';
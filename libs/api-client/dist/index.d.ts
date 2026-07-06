import { ApiResponse, LoginCredentials, RegisterCredentials, AuthResponse, Provider, Booking, Payment, Invoice } from './types';
declare class UrbanApiClient {
    private axiosInstance;
    private baseUrl;
    private accessToken;
    constructor(baseUrl: string);
    private formatError;
    login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>>;
    register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>>;
    logout(): Promise<void>;
    refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>>;
    getProviders(params: {
        latitude?: number;
        longitude?: number;
        radius?: number;
        serviceType?: string;
    }): Promise<ApiResponse<Provider[]>>;
    getProviderById(id: string): Promise<ApiResponse<Provider>>;
    uploadProviderDocument(providerId: string, documentType: 'meisterbrief' | 'idCard' | 'insurance' | 'bankStatement', file: File | Blob, metadata?: any): Promise<ApiResponse<any>>;
    getProviderVerificationStatus(providerId: string): Promise<ApiResponse<any>>;
    createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Booking>>;
    getBookingById(id: string): Promise<ApiResponse<Booking>>;
    updateBookingStatus(id: string, status: Booking['status']): Promise<ApiResponse<Booking>>;
    getBookingsByCustomer(customerId: string): Promise<ApiResponse<Booking[]>>;
    getBookingsByProvider(providerId: string): Promise<ApiResponse<Booking[]>>;
    createPayment(paymentData: {
        bookingId: string;
        amount: number;
        paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
        paymentMethodId?: string;
    }): Promise<ApiResponse<Payment>>;
    getPaymentById(id: string): Promise<ApiResponse<Payment>>;
    getPaymentsByBooking(bookingId: string): Promise<ApiResponse<Payment[]>>;
    getInvoiceById(id: string): Promise<ApiResponse<Invoice>>;
    generateInvoicePdf(invoiceId: string): Promise<ApiResponse<{
        pdfUrl: string;
    }>>;
    generateInvoiceXml(invoiceId: string): Promise<ApiResponse<{
        xmlUrl: string;
    }>>;
    getInvoicesByBooking(bookingId: string): Promise<ApiResponse<Invoice[]>>;
    getInvoicesByCustomer(customerId: string): Promise<ApiResponse<Invoice[]>>;
    getInvoicesByProvider(providerId: string): Promise<ApiResponse<Invoice[]>>;
    setAuth(token: string): void;
    clearAuth(): void;
    getAuthToken(): string | null;
    private formatResponse;
}
export default UrbanApiClient;
export * from './types';

import UrbanApiClient, { Payment, ApiError } from '../index';
export declare const usePayments: (apiClient: UrbanApiClient) => {
    payments: Payment[];
    loading: boolean;
    error: ApiError | null;
    createPayment: (paymentData: {
        bookingId: string;
        amount: number;
        paymentMethod: "credit_card" | "paypal" | "bank_transfer" | "cash";
        paymentMethodId?: string;
    }) => Promise<import("../types").ApiResponse<Payment>>;
    getPaymentById: (id: string) => Promise<import("../types").ApiResponse<Payment>>;
    getPaymentsByBooking: (bookingId: string) => Promise<import("../types").ApiResponse<Payment[]>>;
};

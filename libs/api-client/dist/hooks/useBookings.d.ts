import UrbanApiClient, { Booking, ApiError } from '../index';
export declare const useBookings: (apiClient: UrbanApiClient) => {
    bookings: Booking[];
    loading: boolean;
    error: ApiError | null;
    createBooking: (bookingData: Omit<Booking, "id" | "status" | "createdAt" | "updatedAt">) => Promise<import("../types").ApiResponse<Booking>>;
    getBookingById: (id: string) => Promise<import("../types").ApiResponse<Booking>>;
    updateBookingStatus: (id: string, status: Booking["status"]) => Promise<import("../types").ApiResponse<Booking>>;
    getBookingsByCustomer: (customerId: string) => Promise<import("../types").ApiResponse<Booking[]>>;
    getBookingsByProvider: (providerId: string) => Promise<import("../types").ApiResponse<Booking[]>>;
};

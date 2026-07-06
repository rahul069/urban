import UrbanApiClient, { Invoice, ApiError } from '../index';
export declare const useInvoices: (apiClient: UrbanApiClient) => {
    invoices: Invoice[];
    loading: boolean;
    error: ApiError | null;
    getInvoiceById: (id: string) => Promise<import("../types").ApiResponse<Invoice>>;
    generateInvoicePdf: (invoiceId: string) => Promise<import("../types").ApiResponse<{
        pdfUrl: string;
    }>>;
    generateInvoiceXml: (invoiceId: string) => Promise<import("../types").ApiResponse<{
        xmlUrl: string;
    }>>;
    getInvoicesByBooking: (bookingId: string) => Promise<import("../types").ApiResponse<Invoice[]>>;
    getInvoicesByCustomer: (customerId: string) => Promise<import("../types").ApiResponse<Invoice[]>>;
    getInvoicesByProvider: (providerId: string) => Promise<import("../types").ApiResponse<Invoice[]>>;
};

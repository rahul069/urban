import UrbanApiClient, { Provider, ApiError } from '../index';
export declare const useProviders: (apiClient: UrbanApiClient) => {
    providers: Provider[];
    loading: boolean;
    error: ApiError | null;
    getProviders: (params?: {
        latitude?: number;
        longitude?: number;
        radius?: number;
        serviceType?: string;
    }) => Promise<import("../types").ApiResponse<Provider[]>>;
    getProviderById: (id: string) => Promise<import("../types").ApiResponse<Provider>>;
    uploadProviderDocument: (providerId: string, documentType: "meisterbrief" | "idCard" | "insurance" | "bankStatement", file: File | Blob, metadata?: any) => Promise<import("../types").ApiResponse<any>>;
    getProviderVerificationStatus: (providerId: string) => Promise<import("../types").ApiResponse<any>>;
};

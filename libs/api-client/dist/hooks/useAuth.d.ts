import UrbanApiClient, { LoginCredentials, RegisterCredentials, AuthResponse, ApiError } from '../index';
export declare const useAuth: (apiClient: UrbanApiClient) => {
    user: any;
    loading: boolean;
    error: ApiError | null;
    login: (credentials: LoginCredentials) => Promise<import("../types").ApiResponse<AuthResponse>>;
    register: (credentials: RegisterCredentials) => Promise<import("../types").ApiResponse<AuthResponse>>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isCustomer: boolean;
    isProvider: boolean;
};

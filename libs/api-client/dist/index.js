"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const react_native_1 = require("react-native");
const errorHandler_1 = require("./utils/errorHandler");
// API Client Class
class UrbanApiClient {
    constructor(baseUrl) {
        this.accessToken = null;
        this.baseUrl = baseUrl;
        this.axiosInstance = axios_1.default.create({
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
        this.axiosInstance.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                // Handle 401 Unauthorized
                if (error.response.status === 401) {
                    this.clearAuth();
                    // In a real app, you would redirect to login here
                }
            }
            return Promise.reject(this.formatError(error));
        });
    }
    formatError(error) {
        return errorHandler_1.ApiErrorHandler.handleError(error);
    }
    // Auth Methods
    login(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post('/auth/login', credentials);
            this.setAuth(response.data.data.accessToken);
            return this.formatResponse(response);
        });
    }
    register(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post('/auth/register', credentials);
            this.setAuth(response.data.data.accessToken);
            return this.formatResponse(response);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearAuth();
            // In a real app, you would call the backend logout endpoint
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post('/auth/refresh', { refreshToken });
            this.setAuth(response.data.data.accessToken);
            return this.formatResponse(response);
        });
    }
    // Provider Methods
    getProviders(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get('/providers', { params });
            return this.formatResponse(response);
        });
    }
    getProviderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/providers/${id}`);
            return this.formatResponse(response);
        });
    }
    uploadProviderDocument(providerId, documentType, file, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('document', file);
            if (metadata) {
                formData.append('metadata', JSON.stringify(metadata));
            }
            const response = yield this.axiosInstance.post(`/providers/${providerId}/documents/${documentType}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return this.formatResponse(response);
        });
    }
    getProviderVerificationStatus(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/providers/${providerId}/verification`);
            return this.formatResponse(response);
        });
    }
    // Booking Methods
    createBooking(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post('/bookings', bookingData);
            return this.formatResponse(response);
        });
    }
    getBookingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/bookings/${id}`);
            return this.formatResponse(response);
        });
    }
    updateBookingStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.patch(`/bookings/${id}/status`, { status });
            return this.formatResponse(response);
        });
    }
    getBookingsByCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/bookings/customer/${customerId}`);
            return this.formatResponse(response);
        });
    }
    getBookingsByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/bookings/provider/${providerId}`);
            return this.formatResponse(response);
        });
    }
    // Payment Methods
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post('/payments', paymentData);
            return this.formatResponse(response);
        });
    }
    getPaymentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/payments/${id}`);
            return this.formatResponse(response);
        });
    }
    getPaymentsByBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/payments/booking/${bookingId}`);
            return this.formatResponse(response);
        });
    }
    // Invoice Methods
    getInvoiceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/invoices/${id}`);
            return this.formatResponse(response);
        });
    }
    generateInvoicePdf(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post(`/invoices/${invoiceId}/generate-pdf`);
            return this.formatResponse(response);
        });
    }
    generateInvoiceXml(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.post(`/invoices/${invoiceId}/generate-xml`);
            return this.formatResponse(response);
        });
    }
    getInvoicesByBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/invoices/booking/${bookingId}`);
            return this.formatResponse(response);
        });
    }
    getInvoicesByCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/invoices/customer/${customerId}`);
            return this.formatResponse(response);
        });
    }
    getInvoicesByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(`/invoices/provider/${providerId}`);
            return this.formatResponse(response);
        });
    }
    // Utility Methods
    setAuth(token) {
        this.accessToken = token;
        // Store token in secure storage (implementation depends on platform)
        if (react_native_1.Platform.OS === 'web') {
            localStorage.setItem('accessToken', token);
        }
        else {
            // For React Native, use AsyncStorage or SecureStore
        }
    }
    clearAuth() {
        this.accessToken = null;
        // Clear token from storage
        if (react_native_1.Platform.OS === 'web') {
            localStorage.removeItem('accessToken');
        }
        else {
            // For React Native
        }
    }
    getAuthToken() {
        if (this.accessToken)
            return this.accessToken;
        // Try to get from storage
        if (react_native_1.Platform.OS === 'web') {
            return localStorage.getItem('accessToken');
        }
        else {
            // For React Native
            return null;
        }
    }
    formatResponse(response) {
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText,
        };
    }
}
exports.default = UrbanApiClient;
__exportStar(require("./types"), exports);

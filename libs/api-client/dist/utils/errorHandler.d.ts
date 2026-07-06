import { ApiError } from '../types';
export declare class ApiErrorHandler {
    static handleError(error: any): ApiError;
    static getErrorMessage(error: any): string;
    static isNetworkError(error: any): boolean;
    static isAuthError(error: any): boolean;
    static isNotFoundError(error: any): boolean;
}
export declare const handleApiError: (error: any, context?: string) => ApiError;

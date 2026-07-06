import { ApiError } from '../types';

export class ApiErrorHandler {
  static handleError(error: any): ApiError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        message: error.response.data.message || 'An error occurred',
        statusCode: error.response.status,
        errors: error.response.data.errors || null,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
        errors: null,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || 'An unexpected error occurred',
        statusCode: 0,
        errors: null,
      };
    }
  }

  static getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    
    return 'An unexpected error occurred';
  }

  static isNetworkError(error: any): boolean {
    return !error.response && !!error.request;
  }

  static isAuthError(error: any): boolean {
    return error.response && error.response.status === 401;
  }

  static isNotFoundError(error: any): boolean {
    return error.response && error.response.status === 404;
  }
}

export const handleApiError = (error: any, context: string = ''): ApiError => {
  const apiError = ApiErrorHandler.handleError(error);
  console.error(`[API Error] ${context}:`, apiError);
  return apiError;
};
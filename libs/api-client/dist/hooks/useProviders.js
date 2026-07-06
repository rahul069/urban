"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProviders = void 0;
const react_1 = require("react");
const useProviders = (apiClient) => {
    const [providers, setProviders] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const getProviders = (0, react_1.useCallback)((...args_1) => __awaiter(void 0, [...args_1], void 0, function* (params = {}) {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getProviders(params);
            setProviders(response.data);
            return response;
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [apiClient]);
    const getProviderById = (0, react_1.useCallback)((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getProviderById(id);
            return response;
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [apiClient]);
    const uploadProviderDocument = (0, react_1.useCallback)((providerId, documentType, file, metadata) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.uploadProviderDocument(providerId, documentType, file, metadata);
            return response;
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [apiClient]);
    const getProviderVerificationStatus = (0, react_1.useCallback)((providerId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getProviderVerificationStatus(providerId);
            return response;
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [apiClient]);
    return {
        providers,
        loading,
        error,
        getProviders,
        getProviderById,
        uploadProviderDocument,
        getProviderVerificationStatus,
    };
};
exports.useProviders = useProviders;

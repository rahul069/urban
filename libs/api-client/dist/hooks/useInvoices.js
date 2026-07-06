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
exports.useInvoices = void 0;
const react_1 = require("react");
const useInvoices = (apiClient) => {
    const [invoices, setInvoices] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const getInvoiceById = (0, react_1.useCallback)((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getInvoiceById(id);
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
    const generateInvoicePdf = (0, react_1.useCallback)((invoiceId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.generateInvoicePdf(invoiceId);
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
    const generateInvoiceXml = (0, react_1.useCallback)((invoiceId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.generateInvoiceXml(invoiceId);
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
    const getInvoicesByBooking = (0, react_1.useCallback)((bookingId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getInvoicesByBooking(bookingId);
            setInvoices(response.data);
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
    const getInvoicesByCustomer = (0, react_1.useCallback)((customerId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getInvoicesByCustomer(customerId);
            setInvoices(response.data);
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
    const getInvoicesByProvider = (0, react_1.useCallback)((providerId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getInvoicesByProvider(providerId);
            setInvoices(response.data);
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
        invoices,
        loading,
        error,
        getInvoiceById,
        generateInvoicePdf,
        generateInvoiceXml,
        getInvoicesByBooking,
        getInvoicesByCustomer,
        getInvoicesByProvider,
    };
};
exports.useInvoices = useInvoices;

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
exports.usePayments = void 0;
const react_1 = require("react");
const usePayments = (apiClient) => {
    const [payments, setPayments] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const createPayment = (0, react_1.useCallback)((paymentData) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.createPayment(paymentData);
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
    const getPaymentById = (0, react_1.useCallback)((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getPaymentById(id);
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
    const getPaymentsByBooking = (0, react_1.useCallback)((bookingId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getPaymentsByBooking(bookingId);
            setPayments(response.data);
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
        payments,
        loading,
        error,
        createPayment,
        getPaymentById,
        getPaymentsByBooking,
    };
};
exports.usePayments = usePayments;

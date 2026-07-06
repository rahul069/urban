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
exports.useBookings = void 0;
const react_1 = require("react");
const useBookings = (apiClient) => {
    const [bookings, setBookings] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const createBooking = (0, react_1.useCallback)((bookingData) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.createBooking(bookingData);
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
    const getBookingById = (0, react_1.useCallback)((id) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getBookingById(id);
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
    const updateBookingStatus = (0, react_1.useCallback)((id, status) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.updateBookingStatus(id, status);
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
    const getBookingsByCustomer = (0, react_1.useCallback)((customerId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getBookingsByCustomer(customerId);
            setBookings(response.data);
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
    const getBookingsByProvider = (0, react_1.useCallback)((providerId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.getBookingsByProvider(providerId);
            setBookings(response.data);
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
        bookings,
        loading,
        error,
        createBooking,
        getBookingById,
        updateBookingStatus,
        getBookingsByCustomer,
        getBookingsByProvider,
    };
};
exports.useBookings = useBookings;

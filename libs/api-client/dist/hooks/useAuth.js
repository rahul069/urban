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
exports.useAuth = void 0;
const react_1 = require("react");
const useAuth = (apiClient) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // Check auth status on mount
    (0, react_1.useEffect)(() => {
        const checkAuth = () => __awaiter(void 0, void 0, void 0, function* () {
            const token = apiClient.getAuthToken();
            if (token) {
                // In a real app, you would verify the token with the backend
                // For now, just set a mock user
                setUser({
                    id: 'mock-user-id',
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    userType: 'customer',
                });
            }
        });
        checkAuth();
    }, [apiClient]);
    const login = (0, react_1.useCallback)((credentials) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.login(credentials);
            setUser(response.data.user);
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
    const register = (0, react_1.useCallback)((credentials) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield apiClient.register(credentials);
            setUser(response.data.user);
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
    const logout = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            yield apiClient.logout();
            setUser(null);
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
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isCustomer: (user === null || user === void 0 ? void 0 : user.userType) === 'customer',
        isProvider: (user === null || user === void 0 ? void 0 : user.userType) === 'provider',
    };
};
exports.useAuth = useAuth;

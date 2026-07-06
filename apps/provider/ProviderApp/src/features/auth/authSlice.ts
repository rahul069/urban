"use strict";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import api from '../../services/api';

interface AuthState {
  token: string | null;
  role: 'customer' | 'provider' | 'admin' | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; role: 'customer' | 'provider' | 'admin' }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

export const loginUser = (
  email: string,
  password: string
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post('/auth/login', { email, password });
    dispatch(setCredentials({ token: response.token, role: response.role }));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerUser = (
  email: string,
  password: string,
  role: 'customer' | 'provider'
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post('/auth/register', { email, password, role });
    dispatch(setCredentials({ token: response.token, role: response.role }));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
"use strict";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import { getVerificationQueue, reviewVerification } from '../../services/verification';

interface Document {
  type: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  expiry?: string;
}

interface VerificationHistory {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  notes?: string;
  changedBy?: string;
  createdAt: string;
}

interface VerificationRequest {
  providerId: string;
  name: string;
  email: string;
  documents: Document[];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  notes?: string;
  hwkNumber?: string;
  insuranceExpiry?: string;
  nextReverificationDate?: string;
  history: VerificationHistory[];
}

interface VerificationState {
  queue: VerificationRequest[];
  expiring: VerificationRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: VerificationState = {
  queue: [],
  expiring: [],
  loading: false,
  error: null,
};

export const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setVerificationQueue: (state, action: PayloadAction<VerificationRequest[]>) => {
      state.queue = action.payload;
    },
    updateVerificationRequest: (state, action: PayloadAction<VerificationRequest>) => {
      const index = state.queue.findIndex((req) => req.providerId === action.payload.providerId);
      if (index !== -1) {
        state.queue[index] = { ...state.queue[index], ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setExpiringVerifications: (state, action: PayloadAction<VerificationRequest[]>) => {
      state.expiring = action.payload;
    },
  },
});

export const { setVerificationQueue, updateVerificationRequest, setLoading, setError, setExpiringVerifications } = verificationSlice.actions;

export const fetchVerificationQueue = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const queue = await getVerificationQueue();
    dispatch(setVerificationQueue(queue));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const reviewVerificationRequest = (
  providerId: string,
  status: 'approved' | 'rejected' | 'expired',
  notes?: string
): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    await reviewVerification(providerId, status, notes);
    const queue = getState().verification.queue.map((req) =>
      req.providerId === providerId ? { ...req, status, notes } : req
    );
    dispatch(setVerificationQueue(queue));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchVerificationHistory = (providerId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const history = await getVerificationHistory(providerId);
    dispatch(updateVerificationRequest({ providerId, history }));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchExpiringVerifications = (days: number = 30): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const expiring = await getExpiringVerifications(days);
    dispatch(setExpiringVerifications(expiring));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default verificationSlice.reducer;
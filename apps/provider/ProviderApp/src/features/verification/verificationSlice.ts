"use strict";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import { uploadDocument, getVerificationStatus } from '../../services/verification';

interface VerificationState {
  status: 'pending' | 'approved' | 'rejected' | null;
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  loading: boolean;
  error: string | null;
}

const initialState: VerificationState = {
  status: null,
  documents: [],
  loading: false,
  error: null,
};

export const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setVerificationStatus: (state, action: PayloadAction<{ status: 'pending' | 'approved' | 'rejected'; documents: VerificationState['documents'] }>) => {
      state.status = action.payload.status;
      state.documents = action.payload.documents;
    },
    setDocumentStatus: (state, action: PayloadAction<{ type: string; status: 'pending' | 'approved' | 'rejected' }>) => {
      const document = state.documents.find((doc) => doc.type === action.payload.type);
      if (document) {
        document.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setVerificationStatus, setDocumentStatus, setLoading, setError } = verificationSlice.actions;

export const uploadVerificationDocument = (
  documentType: string,
  file: File
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await uploadDocument(documentType, file);
    dispatch(setDocumentStatus({ type: documentType, status: 'pending' }));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchVerificationStatus = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { status, documents } = await getVerificationStatus();
    dispatch(setVerificationStatus({ status, documents }));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default verificationSlice.reducer;
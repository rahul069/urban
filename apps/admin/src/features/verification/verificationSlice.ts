import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Provider {
  id: string;
  name: string;
  documents: { type: string; status: 'pending' | 'approved' | 'rejected' }[];
}

interface VerificationState {
  providers: Provider[];
}

const initialState: VerificationState = {
  providers: [
    {
      id: '1',
      name: 'Cleaning Pros',
      documents: [
        { type: 'business_license', status: 'pending' },
        { type: 'insurance', status: 'pending' },
      ],
    },
    {
      id: '2',
      name: 'Plumbing Masters',
      documents: [
        { type: 'business_license', status: 'pending' },
        { type: 'certification', status: 'pending' },
      ],
    },
  ],
};

export const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    updateDocumentStatus: (
      state,
      action: PayloadAction<{ providerId: string; documentType: string; status: 'approved' | 'rejected' }>
    ) => {
      const provider = state.providers.find((p) => p.id === action.payload.providerId);
      if (provider) {
        const document = provider.documents.find((d) => d.type === action.payload.documentType);
        if (document) {
          document.status = action.payload.status;
        }
      }
    },
  },
});

export const { updateDocumentStatus } = verificationSlice.actions;
export default verificationSlice.reducer;
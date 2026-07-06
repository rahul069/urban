"use strict";
import { configureStore } from '@reduxjs/toolkit';
import verificationReducer from '../features/verification/verificationSlice';
import bookingReducer from '../features/booking/bookingSlice';

export const store = configureStore({
  reducer: {
    verification: verificationReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (dispatch: AppDispatch, getState: () => RootState) => ReturnType;
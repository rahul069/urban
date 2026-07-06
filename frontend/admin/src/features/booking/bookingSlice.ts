"use strict";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import { getBookings, getBookingDetails } from '../../services/booking';

interface Booking {
  id: string;
  providerId: string;
  customerId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
  notes?: string;
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setBookings, setCurrentBooking, setLoading, setError } = bookingSlice.actions;

export const fetchBookings = (status?: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const bookings = await getBookings(status);
    dispatch(setBookings(bookings));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchBookingDetails = (bookingId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const booking = await getBookingDetails(bookingId);
    dispatch(setCurrentBooking(booking));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default bookingSlice.reducer;
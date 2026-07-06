"use strict";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';
import { requestBooking, getBookings, getBookingDetails, updateBookingStatus } from '../../services/booking';

interface Booking {
  id: string;
  providerId: string;
  serviceId: string;
  customerId: string;
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
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Booking['status'] }>) => {
      const booking = state.bookings.find((b) => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
      if (state.currentBooking?.id === action.payload.id) {
        state.currentBooking.status = action.payload.status;
      }
    },
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setBookings, addBooking, updateBookingStatus, setCurrentBooking, clearCurrentBooking, setLoading, setError } = bookingSlice.actions;

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

export const createBooking = (
  providerId: string,
  serviceId: string,
  scheduledAt: string,
  notes?: string
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const booking = await requestBooking(providerId, serviceId, scheduledAt, notes);
    dispatch(addBooking(booking));
    return booking;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
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

export const updateBooking = (
  bookingId: string,
  status: 'in_progress' | 'completed' | 'cancelled'
): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await updateBookingStatus(bookingId, status);
    dispatch(updateBookingStatus({ id: bookingId, status }));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default bookingSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  providerId: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  address: string;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: Booking['status'] }>) => {
      const booking = state.bookings.find((b) => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
    },
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
});

export const { addBooking, updateBookingStatus, setCurrentBooking, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Booking {
  id: string;
  customer: string;
  provider: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
}

interface BookingState {
  bookings: Booking[];
}

const initialState: BookingState = {
  bookings: [
    {
      id: '1',
      customer: 'John Doe',
      provider: 'Cleaning Pros',
      serviceType: 'cleaning',
      status: 'pending',
      date: '2026-07-05',
    },
    {
      id: '2',
      customer: 'Jane Smith',
      provider: 'Plumbing Masters',
      serviceType: 'plumbing',
      status: 'confirmed',
      date: '2026-07-06',
    },
  ],
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBookingStatus: (
      state,
      action: PayloadAction<{ id: string; status: Booking['status'] }>
    ) => {
      const booking = state.bookings.find((b) => b.id === action.payload.id);
      if (booking) {
        booking.status = action.payload.status;
      }
    },
  },
});

export const { updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
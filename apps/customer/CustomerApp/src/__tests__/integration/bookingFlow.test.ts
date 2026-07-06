"use strict";
import { store } from '../../store';
import { createBooking, fetchBookings, updateBooking } from '../../features/booking/bookingSlice';
import { loginUser } from '../../features/auth/authSlice';
import { mockWorker } from '../../services/mock';

beforeAll(() => {
  mockWorker.start();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockWorker.stop();
});

describe('Booking Flow Integration', () => {
  beforeEach(async () => {
    await store.dispatch(loginUser('test@example.com', 'password'));
  });

  it('should create a booking and fetch bookings', async () => {
    const booking = await store.dispatch(
      createBooking('provider-1', 'service-1', new Date(Date.now() + 86400000).toISOString())
    );
    expect(booking).toHaveProperty('id');
    expect(booking.status).toBe('pending');

    await store.dispatch(fetchBookings());
    const state = store.getState();
    expect(state.booking.bookings).toContainEqual(expect.objectContaining({
      id: booking.id,
      status: 'pending',
    }));
  });

  it('should update booking status', async () => {
    const booking = await store.dispatch(
      createBooking('provider-1', 'service-1', new Date(Date.now() + 86400000).toISOString())
    );

    await store.dispatch(updateBooking(booking.id, 'completed'));
    const state = store.getState();
    const updatedBooking = state.booking.bookings.find((b) => b.id === booking.id);
    expect(updatedBooking?.status).toBe('completed');
  });
});
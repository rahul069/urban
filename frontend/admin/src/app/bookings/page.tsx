"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../features/booking/bookingSlice';
import { RootState, AppDispatch } from '../../store';

export default function BookingMonitor() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, error } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Monitor</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Booking ID</th>
              <th className="py-2 px-4 border">Provider</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Scheduled At</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="py-2 px-4 border">{booking.id}</td>
                <td className="py-2 px-4 border">{booking.providerId}</td>
                <td className="py-2 px-4 border">{booking.customerId}</td>
                <td className="py-2 px-4 border">{booking.status}</td>
                <td className="py-2 px-4 border">{new Date(booking.scheduledAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
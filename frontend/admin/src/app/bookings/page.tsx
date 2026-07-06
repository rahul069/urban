"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useApi } from '@/context/ApiContext';

const BookingMonitor = () => {
  const { t } = useTranslation();
  const { bookings } = useApi();
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        await bookings.getBookings();
        setBookingList([
          {
            id: '1',
            customer: 'John Smith',
            provider: 'John Doe Plumbing',
            serviceType: 'Plumbing',
            date: '2026-07-15',
            status: 'requested',
          },
          {
            id: '2',
            customer: 'Jane Doe',
            provider: 'Acme Electric',
            serviceType: 'Electrical',
            date: '2026-07-16',
            status: 'accepted',
          },
        ]);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [bookings]);

  const handleStatusChange = async (id: string, status: string) => {
    setBookingList(prev => prev.map(booking =>
      booking.id === id ? { ...booking, status } : booking
    ));
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('bookings.title')}</h1>
      <div className="space-y-4">
        {bookingList.map((booking) => (
          <div key={booking.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{booking.customer}</h2>
                <p className="text-gray-600">{booking.provider} - {booking.serviceType}</p>
                <p className="text-sm text-gray-500">{booking.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  booking.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                  booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="requested">{t('bookings.pending')}</option>
                  <option value="accepted">{t('bookings.confirmed')}</option>
                  <option value="completed">{t('bookings.completed')}</option>
                  <option value="cancelled">{t('bookings.cancelled')}</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingMonitor;
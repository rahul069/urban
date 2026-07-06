
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import './BookingMonitor.css';

const BookingMonitor = () => {
  const { t } = useTranslation();
  const { bookings } = useApi();
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch all bookings
        await bookings.getBookings(); // Fetch all bookings
        // For now, use mock data structure
        setBookingList([
          {
            id: '1',
            customer: 'John Smith',
            provider: 'John Doe Plumbing',
            serviceType: 'Plumbing',
            date: '2026-07-15',
            status: 'requested'
          },
          {
            id: '2',
            customer: 'Jane Doe',
            provider: 'Acme Electric',
            serviceType: 'Electrical',
            date: '2026-07-16',
            status: 'accepted'
          }
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
    try {
      // In a real app, we would call the API to update the booking status
      console.log(`Updating booking ${id} to status ${status}`);
      // await bookings.updateBookingStatus(id, status);
      
      // Update local state
      setBookingList(prev => prev.map(booking =>
        booking.id === id ? { ...booking, status } : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (loading) {
    return <div className="booking-container">{t('common.loading')}</div>;
  }

  return (
    <div className="booking-container">
      <h1>{t('bookings.title')}</h1>
      <div className="bookings-list">
        {bookingList.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-info">
              <h2>{booking.customer}</h2>
              <p>{booking.provider} - {booking.serviceType}</p>
              <p>{booking.date}</p>
            </div>
            <div className="booking-status">
              <span className={`status ${booking.status}`}>{booking.status}</span>
              <select
                value={booking.status}
                onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
              >
                <option value="pending">{t('bookings.pending')}</option>
                <option value="confirmed">{t('bookings.confirmed')}</option>
                <option value="completed">{t('bookings.completed')}</option>
                <option value="cancelled">{t('bookings.cancelled')}</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingMonitor;
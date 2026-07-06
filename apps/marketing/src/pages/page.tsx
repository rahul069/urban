import { useTranslation } from '../hooks/useTranslation';
import { useDispatch } from 'react-redux';
import { addBooking } from '../features/booking/bookingSlice';
import type { Booking } from '../features/booking/bookingSlice';

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleBooking = () => {
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9),
      providerId: '1',
      serviceType: 'cleaning',
      status: 'confirmed',
      date: new Date().toISOString().split('T')[0],
      address: 'Sample Address, Berlin',
    };
    dispatch(addBooking(newBooking));
    alert(t('booking.success'));
  };

  return (
    <main className="home-container">
      <section className="hero">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <button onClick={handleBooking} className="cta-button">
          {t('hero.cta')}
        </button>
      </section>
      <section className="categories">
        <h2>{t('categories.title')}</h2>
        <div className="category-grid">
          <div className="category-card">
            <span>{t('categories.cleaning')}</span>
          </div>
          <div className="category-card">
            <span>{t('categories.plumbing')}</span>
          </div>
          <div className="category-card">
            <span>{t('categories.electrical')}</span>
          </div>
          <div className="category-card">
            <span>{t('categories.handyman')}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
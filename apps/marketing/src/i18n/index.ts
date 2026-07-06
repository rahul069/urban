import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      hero: {
        title: 'Trusted Home Services in Germany',
        subtitle: 'Book verified professionals for cleaning, plumbing, electrical, and more',
        cta: 'Book Now',
      },
      categories: {
        title: 'Popular Services',
        cleaning: 'Cleaning',
        plumbing: 'Plumbing',
        electrical: 'Electrical',
        handyman: 'Handyman',
      },
      booking: {
        title: 'Book a Service',
        request: 'Request Booking',
        success: 'Booking request sent!',
      },
    },
  },
  de: {
    translation: {
      hero: {
        title: 'Vertrauenswürdige Haushaltsdienstleistungen in Deutschland',
        subtitle: 'Buchen Sie geprüfte Fachkräfte für Reinigung, Klempnerei, Elektrik und mehr',
        cta: 'Jetzt buchen',
      },
      categories: {
        title: 'Beliebte Dienstleistungen',
        cleaning: 'Reinigung',
        plumbing: 'Klempnerei',
        electrical: 'Elektrik',
        handyman: 'Hausmeister',
      },
      booking: {
        title: 'Service buchen',
        request: 'Buchung anfordern',
        success: 'Buchungsanfrage gesendet!',
      },
    },
  },
};

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;
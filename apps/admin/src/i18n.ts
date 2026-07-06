import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        verification: {
          title: 'Verification Queue',
          approve: 'Approve',
          reject: 'Reject',
        },
        bookings: {
          title: 'Booking Monitor',
          pending: 'Pending',
          confirmed: 'Confirmed',
          completed: 'Completed',
          cancelled: 'Cancelled',
        },
        common: {
          loading: 'Loading...',
        },
      },
    },
    de: {
      translation: {
        verification: {
          title: 'Überprüfungswarteschlange',
          approve: 'Genehmigen',
          reject: 'Ablehnen',
        },
        bookings: {
          title: 'Buchungsmonitor',
          pending: 'Ausstehend',
          confirmed: 'Bestätigt',
          completed: 'Abgeschlossen',
          cancelled: 'Abgebrochen',
        },
        common: {
          loading: 'Wird geladen...',
        },
      },
    },
  },
  lng: 'de', // Default to German
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export const initI18n = () => i18n;
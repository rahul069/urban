import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      verification: {
        title: 'Verification Queue',
        pending: 'Pending Verifications',
        approve: 'Approve',
        reject: 'Reject',
      },
      bookings: {
        title: 'Booking Monitor',
        all: 'All Bookings',
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
    },
  },
  de: {
    translation: {
      verification: {
        title: 'Überprüfungswarteschlange',
        pending: 'Ausstehende Überprüfungen',
        approve: 'Genehmigen',
        reject: 'Ablehnen',
      },
      bookings: {
        title: 'Buchungsmonitor',
        all: 'Alle Buchungen',
        pending: 'Ausstehend',
        confirmed: 'Bestätigt',
        completed: 'Abgeschlossen',
        cancelled: 'Storniert',
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
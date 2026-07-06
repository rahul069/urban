import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        hero: {
          title: 'Germany’s Home Services Marketplace',
        },
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
        invoices: {
          title: 'Invoice Management',
        },
        disputes: {
          title: 'Dispute Resolution',
        },
        common: {
          loading: 'Loading...',
        },
      },
    },
    de: {
      translation: {
        hero: {
          title: 'Deutschlands Marktplatz für Haushaltsdienstleistungen',
        },
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
        invoices: {
          title: 'Rechnungsmanagement',
        },
        disputes: {
          title: 'Streitbeilegung',
        },
        common: {
          loading: 'Wird geladen...',
        },
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
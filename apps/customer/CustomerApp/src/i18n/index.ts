import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      categories: {
        title: 'Service Categories',
        cleaning: 'Cleaning',
        plumbing: 'Plumbing',
        electrical: 'Electrical',
        handyman: 'Handyman',
      },
      search: {
        title: 'Search Providers',
        placeholder: 'What service do you need?',
      },
      booking: {
        title: 'Book a Service',
        request: 'Request Booking',
        status: 'Booking Status',
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      profile: {
        title: 'My Profile',
        logout: 'Logout',
      },
    },
  },
  de: {
    translation: {
      categories: {
        title: 'Service-Kategorien',
        cleaning: 'Reinigung',
        plumbing: 'Klempnerei',
        electrical: 'Elektrik',
        handyman: 'Hausmeister',
      },
      search: {
        title: 'Anbieter suchen',
        placeholder: 'Welchen Service benötigen Sie?',
      },
      booking: {
        title: 'Service buchen',
        request: 'Buchung anfordern',
        status: 'Buchungsstatus',
        pending: 'Ausstehend',
        confirmed: 'Bestätigt',
        completed: 'Abgeschlossen',
        cancelled: 'Storniert',
      },
      profile: {
        title: 'Mein Profil',
        logout: 'Abmelden',
      },
    },
  },
};

export const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem('language');
  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage || 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });
};

export default i18n;
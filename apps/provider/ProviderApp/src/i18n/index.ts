import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      onboarding: {
        title: 'Provider Onboarding',
        welcome: 'Welcome to UrbanService',
        documentUpload: 'Upload Documents',
        next: 'Next',
        submit: 'Submit',
      },
      jobs: {
        title: 'Job Requests',
        pending: 'Pending Requests',
        accepted: 'Accepted Jobs',
        completed: 'Completed Jobs',
      },
      profile: {
        title: 'My Profile',
        logout: 'Logout',
      },
    },
  },
  de: {
    translation: {
      onboarding: {
        title: 'Anbieter-Onboarding',
        welcome: 'Willkommen bei UrbanService',
        documentUpload: 'Dokumente hochladen',
        next: 'Weiter',
        submit: 'Einreichen',
      },
      jobs: {
        title: 'Auftragsanfragen',
        pending: 'Ausstehende Anfragen',
        accepted: 'Angenommene Aufträge',
        completed: 'Abgeschlossene Aufträge',
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
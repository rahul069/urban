import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
const resources = {
  en: {
    translation: {
      "hero.title": "Find trusted home service professionals in Berlin",
      "hero.subtitle": "Book electricians, plumbers, and more with verified experts",
      "hero.cta": "Book Now",
      "booking.success": "Booking successful!",
      "categories.title": "Popular Services",
      "categories.cleaning": "Cleaning",
      "categories.plumbing": "Plumbing",
      "categories.electrical": "Electrical",
      "categories.handyman": "Handyman",
    }
  },
  de: {
    translation: {
      "hero.title": "Finden Sie vertrauenswürdige Handwerker in Berlin",
      "hero.subtitle": "Buchen Sie Elektriker, Klempner und mehr mit verifizierten Experten",
      "hero.cta": "Jetzt buchen",
      "booking.success": "Buchung erfolgreich!",
      "categories.title": "Beliebte Dienstleistungen",
      "categories.cleaning": "Reinigung",
      "categories.plumbing": "Klempner",
      "categories.electrical": "Elektriker",
      "categories.handyman": "Handwerker",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "de",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
const translations = {
  en: {
    "hero.title": "Find trusted home service professionals in Berlin",
    "hero.subtitle": "Book electricians, plumbers, and more with verified experts",
    "hero.cta": "Book Now",
    "booking.success": "Booking successful!",
    "categories.title": "Popular Services",
    "categories.cleaning": "Cleaning",
    "categories.plumbing": "Plumbing",
    "categories.electrical": "Electrical",
    "categories.handyman": "Handyman",
  },
  de: {
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
};

export function useTranslation() {
  const locale = 'de';
  const t = (key: string) => translations[locale as keyof typeof translations][key as keyof (typeof translations)[keyof typeof translations]] || key;
  return { t };
}
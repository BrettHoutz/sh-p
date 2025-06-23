// Currency conversion rates (relative to USD)
const currencies = {
  USD: 1,
  ARS: 998.57,
  AUD: 1.55,
  CAD: 1.41,
  EUR: 0.95,
  GBP: 0.79,
  JPY: 154.49,
  MXN: 20.36,
}

// Language names in each language
export const langs = {
  en: {
    en: 'English',
    es: 'Inglés',
  },
  es: {
    en: 'Spanish',
    es: 'Español',
  },
}

// Locale info: currency and country names
export const locales = {
  us: {
    currency: 'USD',
    name: {
      en: 'United States',
      es: 'Estados Unidos',
    },
  },
  ar: {
    currency: 'ARS',
    name: {
      en: 'Argentina',
      es: 'Argentina',
    },
  },
  au: {
    currency: 'AUD',
    name: {
      en: 'Australia',
      es: 'Australia',
    },
  },
  ca: {
    currency: 'CAD',
    name: {
      en: 'Canada',
      es: 'Canadá',
    },
  },
  de: {
    currency: 'EUR',
    name: {
      en: 'Germany',
      es: 'Alemania',
    },
  },
  jp: {
    currency: 'JPY',
    name: {
      en: 'Japan',
      es: 'Japón',
    },
  },
  mx: {
    currency: 'MXN',
    name: {
      en: 'Mexico',
      es: 'México',
    },
  },
  uk: {
    currency: 'GBP',
    name: {
      en: 'United Kingdom',
      es: 'Reino Unido',
    },
  },
}

// Currency and locale types
export type Currency = keyof typeof currencies
export type Locale = keyof typeof locales

// Format a price in a given currency
function formatPrice({ currency = 'USD', price }: { currency?: Currency; price: number }) {
  return price.toLocaleString('en-US', {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  })
}

// Get the currency symbol for a locale
export function getCurrencySymbol({ locale }: { locale: Locale }) {
  if (locale === 'us') {
    return '$'
  }

  const currency = locales[locale].currency as Currency

  // Use toLocaleString to extract symbol
  return (0)
    .toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    .replace(/\d/g, '')
    .trim()
}

// Get formatted price and raw price for a locale
export function getPrice({ locale, price }: { locale: Locale; price: number }) {
  if (locale === 'us') {
    return { formatted: formatPrice({ price }), price }
  }

  const currency = locales[locale].currency as Currency

  // Convert price using currency rate, then format
  return { formatted: formatPrice({ currency, price: price * currencies[currency] }), price }
}

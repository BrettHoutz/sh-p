import 'server-only'
import type { BooleanString, Lang, Medium } from '@/types'
import { flag, generatePermutations } from 'flags/next'
import { langs, type Locale, locales } from '../i18n'
import { COOKIE_CONFIG } from '../util/server'
import { geolocation } from '@vercel/functions'
import { unstable_rootParams } from 'next/server'

/**
 * Flag for managing user's language preference
 * Determines the display language for the application
 */
export const flagLang = flag({
  async decide({ cookies, headers }) {
    const cookie = cookies.get('lang')?.value as Lang
    const defaultValue: Lang = 'en'

    if (cookie) {
      return cookie
    }

    if (!!headers.get('x-bail')) {
      return defaultValue
    }

    // Check accept-language header for English or Spanish
    const acceptLanguage = headers.get('accept-language')
    const parsedLang = parseAcceptLanguage({ acceptLanguage })

    if (parsedLang) {
      cookies.set('lang', parsedLang, COOKIE_CONFIG)
      return parsedLang
    }

    cookies.set('lang', defaultValue, COOKIE_CONFIG)

    return defaultValue
  },
  key: 'lang',
  options: Object.keys(langs),
})

/**
 * Flag for managing user's locale/region preference
 * Uses geolocation to determine the user's country and set appropriate locale
 */
export const flagLocale = flag({
  async decide({ cookies, headers }) {
    const cookie = cookies.get('locale')?.value as Locale
    const defaultValue = 'us'

    if (cookie) {
      return cookie
    }

    if (headers.get('x-bail') === 'true') {
      return defaultValue
    }

    const country = (geolocation({ headers }).country ?? defaultValue).toLowerCase() as Locale
    const decision = Object.keys(locales)
      .map((l) => l[0])
      .includes(country)
      ? country
      : defaultValue

    cookies.set('locale', decision, COOKIE_CONFIG)

    return decision
  },
  key: 'locale',
  options: Object.keys(locales),
})

/**
 * Flag for tracking user acquisition medium
 * Tracks how users arrived at the site (organic, paid, social)
 */
export const flagMedium = flag({
  async decide({ cookies, headers }) {
    if (headers.get('x-bail') === 'true') {
      return 'organic'
    }

    const cookie = cookies.get('medium')?.value as Medium
    const value = headers.get('x-utm-medium') || cookies.get('medium')?.value || 'organic'

    if (cookie === value) {
      return cookie
    }

    cookies.set('medium', value)

    return value
  },
  key: 'medium',
  options: ['organic', 'paid', 'social'],
})

/**
 * Flag for toggling demo mode display
 * Controls whether to show additional metadata and debugging information
 */
export const flagShowDemoMode = flag({
  async decide({ cookies, headers }) {
    const cookie = cookies.get('show-demo-mode')?.value as BooleanString
    const defaultValue = false

    if (cookie) {
      return cookie === 'true'
    }

    if (!!headers.get('x-bail')) {
      return defaultValue
    }

    cookies.set('show-demo-mode', String(defaultValue), COOKIE_CONFIG)

    return defaultValue
  },
  key: 'show-meta-mode',
})

/**
 * Flag for toggling orange theme/styling
 * Randomly assigns users to see orange styling (A/B test)
 */
export const flagShowOrange = flag({
  async decide({ cookies, headers }) {
    const cookie = cookies.get('show-orange')?.value as BooleanString
    const defaultValue = false

    if (cookie) {
      return cookie === 'true'
    }

    if (!!headers.get('x-bail')) {
      return defaultValue
    }

    // Random assignment for A/B testing
    const decision = Math.random() > 0.49

    cookies.set('show-orange', String(decision), COOKIE_CONFIG)

    return decision
  },
  key: 'show-orange',
})

/**
 * Flag for toggling promotional content display
 * Randomly determines whether to show promotional banners/content
 */
export const flagShowPromo = flag({
  async decide({ cookies, headers }) {
    const cookie = cookies.get('show-promo')?.value as BooleanString

    if (cookie) {
      return cookie === 'true'
    }

    if (!!headers.get('x-bail')) {
      return true
    }

    // Random assignment for promotional content testing
    const decision = Math.random() > 0.49

    cookies.set('show-promo', String(decision), COOKIE_CONFIG)

    return decision
  },
  key: 'show-promo',
})

/**
 * Array of all feature flags used in the application
 * Used for generating permutations and batch processing
 */
export const flags = [flagLang, flagLocale, flagMedium, flagShowDemoMode, flagShowOrange, flagShowPromo] as const

/**
 * Generates root parameters for all possible flag combinations
 * Used for static generation and precomputation of flag states
 * @returns Array containing root parameter object
 */
export async function getRootParams() {
  const [root, ..._] = await generatePermutations(flags)

  return [{ root }]
}

/**
 * Parses the accept-language header and returns 'en' or 'es' if found
 * @param acceptLanguage - The accept-language header value
 * @returns 'en' | 'es' | null - Returns the language if English or Spanish is found, null otherwise
 */
function parseAcceptLanguage({ acceptLanguage }: { acceptLanguage: string | null }): Lang | null {
  if (!acceptLanguage) {
    return null
  }

  // Parse accept-language header (format: "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.trim().split(';')[0].split('-')[0].toLowerCase())
    .filter((lang) => lang === 'en' || lang === 'es')

  // Return the first supported language found
  return languages.length > 0 ? (languages[0] as Lang) : null
}

/**
 * Parses and resolves all flag values from a root parameter
 * Extracts individual flag values from the encoded root parameter
 * @param rootParam - Optional root parameter string to parse
 * @returns Object containing all resolved flag values
 */
export async function parseRoot({ rootParam }: { rootParam?: string } = {}) {
  const root = rootParam ?? ((await unstable_rootParams().then((res) => res.root)) as string)

  const [lang, locale, medium, showDemoMode, showOrange, showPromo] = (await Promise.all(
    flags.map((fp) => fp(root, flags)),
  )) as [Lang, Locale, Medium, boolean, boolean, boolean]

  return { lang, locale, medium, showDemoMode, showOrange, showPromo }
}

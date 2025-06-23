'use server'

  import { cookies } from 'next/headers'
  import { COOKIE_CONFIG } from '../util/server'
  import type { Lang } from '@/types'
  import type { Locale } from '.'

  /**
   * Updates the user's language preference
   * @param lang The language code to set
   */
  export async function updateLanguage(lang: Lang) {
    (await cookies()).set('lang', lang, COOKIE_CONFIG)
    return { success: true }
  }

  /**
   * Updates the user's locale preference
   * @param locale The locale code to set
   */
  export async function updateLocale(locale: Locale) {
    (await cookies()).set('locale', locale, COOKIE_CONFIG)
    return { success: true }
  }
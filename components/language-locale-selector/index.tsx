import { langs, locales } from '@/lib/i18n'
import type { Lang } from '@/types'
import LanguageLocaleSelectorClient from './client'
import type { Locale } from '@/lib/i18n'

export default function LanguageLocaleSelector({ lang, locale }: { lang: Lang; locale: Locale }) {
  const langOptions = Object.entries(langs).map(([key, value]) => {
    return [key, value[lang]] as [Lang, string]
  })
  const localeOptions = Object.entries(locales).map(([key, value]) => {
    return [key, value.name[lang]] as [Locale, string]
  })

  return (
    <LanguageLocaleSelectorClient lang={lang} langOptions={langOptions} locale={locale} localeOptions={localeOptions} />
  )
}

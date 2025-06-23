'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Lang } from '@/types'
import type { Locale } from '@/lib/i18n'
import { updateLanguage, updateLocale } from '@/lib/i18n/actions'

// Client component for selecting language and locale/region
export default function LanguageLocaleSelectorClient({
  lang,
  langOptions,
  locale,
  localeOptions,
}: {
  lang: Lang
  langOptions: [Lang, string][]
  locale: Locale
  localeOptions: [Locale, string][]
}) {
  const router = useRouter()
  // Prevent multiple simultaneous changes
  const [isChanging, setIsChanging] = useState(false)

  // Update language and refresh page
  async function handleLangChange(newLang: Lang) {
    if (newLang === lang || isChanging) return

    setIsChanging(true)

    await updateLanguage(newLang)
    router.refresh()
  }

  // Update locale and refresh page
  async function handleLocaleChange(newLocale: Locale) {
    if (newLocale === locale || isChanging) return

    setIsChanging(true)

    await updateLocale(newLocale)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 gap-8 p-4">
      {/* Language selector */}
      <div className="grid grid-cols-1">
        <h3>{lang === 'en' ? 'Language' : 'Idioma'}</h3>
        <div className="flex flex-wrap gap-4">
          {langOptions.map(([key, value]) => (
            <button
              key={key}
              className={`cursor-pointer text-[darkorchid] first-letter:uppercase data-[selected=true]:text-[orchid]`}
              data-selected={lang === key}
              disabled={isChanging}
              onClick={() => handleLangChange(key)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Region/locale selector */}
      <div className="grid grid-cols-1">
        <h3>{lang === 'en' ? 'Region' : 'Región'}</h3>
        <div className="flex flex-wrap gap-x-4">
          {localeOptions.map(([key, value]) => (
            <button
              key={key}
              className={`cursor-pointer text-[darkorchid] first-letter:uppercase data-[selected=true]:text-[orchid]`}
              data-selected={locale === key}
              disabled={isChanging}
              onClick={() => handleLocaleChange(key)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

import { getTranslation } from '@/lib/i18n/server'
import type { Lang } from '@/types'

export default function Footer({ lang }: { lang: Lang }) {
  // Get the translated footer text based on the language
  const footerText = getTranslation({ lang, key: 'footerPoweredBy' })

  if (!footerText) {
    return null
  }

  return <footer className="p-4">{footerText}</footer>
}

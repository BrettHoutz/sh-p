import type { Lang } from '@/types'
import Link from '../link'

export default async function Promo({ lang }: { lang: Lang }) {
  // Define translations for the promo message
  const promoText = {
    en: 'Our best sale of the season is here! Save up to 50% now.',
    es: 'Nuestra mejor venta de la temporada está aquí! Ahorra hasta un 50% ahora.',
  }

  // Get the appropriate text based on language
  const text = lang === 'es' ? promoText.es : promoText.en

  return (
    <div className="p-4">
      <Link className="text-[deeppink]" href="/collections/tee">
        {text}
      </Link>
    </div>
  )
}

import { getTranslation } from '@/lib/i18n/server'
import type { Lang } from '@/types'

export default function EmptyCart({ lang }: { lang: Lang }) {
  const emptyCartText = getTranslation({ key: 'cartEmpty', lang })

  return <p className="text-[gray]">{emptyCartText}.</p>
}

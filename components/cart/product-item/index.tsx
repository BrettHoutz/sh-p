import type { Lang, Product } from '@/types'
import { getPrice } from '@/lib/i18n'
import { getTranslation } from '@/lib/i18n/server'
import type { Locale } from '@/lib/i18n'
import Link from '@/components/link'
import { titleCase } from '@/lib/util'

export default function CartProductItem({
  product,
  variantId,
  lang,
  locale,
}: {
  product: Product
  variantId: string
  lang: Lang
  locale: Locale
}) {
  const productType = getTranslation({ key: `types.${product.type}`, lang })

  // Find the variant in the product using the passed variantId
  const variant = product.variants.find((v) => v.id === variantId)

  // Get the translated color name
  const colorTranslation = variant ? getTranslation({ key: `colors.${variant.color}`, lang }) : ''

  return (
    <div>
      <Link className="text-[lime]" href={`/products/${product.slug}`}>
        {product.title} {titleCase(productType || '')}
      </Link>
      <div>{getPrice({ locale, price: product.price }).formatted}</div>
      {variant && (
        <div>
          {titleCase(colorTranslation || '')} / {variant.size.toUpperCase()}
        </div>
      )}
    </div>
  )
}

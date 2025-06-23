import type { Lang, ListProduct as ListProductType } from '@/types'
import { getPrice } from '@/lib/i18n'
import { getTranslation } from '@/lib/i18n/server'
import Link from '../link'
import ListProductRefresh from '../list-product-refresh/client'
import type { Locale } from '@/lib/i18n'
import { titleCase } from '@/lib/util'

// Component to display a product in list format
export default function ListProduct({
  enableRefresh = false,
  lang,
  locale,
  product,
}: {
  enableRefresh?: boolean
  lang: Lang
  locale: Locale
  product: ListProductType
}) {
  // Get translated product type
  const productType = getTranslation({ key: `types.${product.type}`, lang })

  return (
    <ul>
      {/* Product title and type as link */}
      <li>
        <Link className="text-[lime]" href={`/products/${product.slug}`}>
          {product.title} {titleCase(productType!)}
        </Link>
      </li>
      {/* Product price with optional refresh button */}
      <li>
        {getPrice({ locale, price: product.price }).formatted}
        {enableRefresh && (
          <>
            {' '}
            <ListProductRefresh product={product} />
          </>
        )}
      </li>
    </ul>
  )
}

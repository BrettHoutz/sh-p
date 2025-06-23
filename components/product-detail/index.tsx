import type { Color, Lang, Product, ProductSize } from '@/types'
import { getTranslation } from '@/lib/i18n/server'
import Link from '@/components/link'
import ListProduct from '@/components/list-product'
import type { Locale } from '@/lib/i18n'
import ProductVariantSelector from '@/components/product-variant-selector'
import { titleCase } from '@/lib/util'

/**
 * Product detail component that displays comprehensive product information
 * including breadcrumb navigation, product listing, description, and variant selection
 *
 * Handles internationalization and conditional features like demo mode and paid ad tracking
 */
export default function ProductDetail({
  colors,
  lang,
  locale,
  medium,
  product,
  showDemoMode,
  sizes,
  variantId,
}: {
  colors: Color[]
  lang: Lang
  locale: Locale
  medium: string
  product: Product
  showDemoMode: boolean
  sizes: ProductSize[]
  variantId?: string
}) {
  // Get translated demographic and product type for breadcrumb navigation
  // Falls back to original values if translations are not available
  const translatedDemographic =
    getTranslation({ key: `demographics.${product.demographic}`, lang }) || product.demographic
  const translatedType = getTranslation({ key: `types.${product.type}`, lang }) || product.type

  return (
    <article className="order-1 grid grid-cols-1 gap-y-4">
      {/* Breadcrumb navigation showing product category hierarchy */}
      <p className="text-[darkslategray]">
        {/* Link to demographic collection (e.g., "Men", "Women") */}
        <Link className="text-[aquamarine]" href={`/collections/${product.demographic}`}>
          {titleCase(translatedDemographic)}
        </Link>
        {' / '}
        {/* Link to product type collection (e.g., "Shirts", "Pants") */}
        <Link className="text-[aquamarine]" href={`/collections/${product.type}`}>
          {titleCase(translatedType)}
        </Link>
      </p>

      {/* Main product listing component with optional refresh functionality */}
      <ListProduct enableRefresh={showDemoMode} lang={lang} locale={locale} product={product} />

      {/* Conditional message for users who arrived via paid advertising */}
      {medium === 'paid' && <p>This user arrived through a paid ad so let's make their visit count!</p>}

      {/* Product description in the current language */}
      {/* Uses non-null assertion (!) since we expect description to exist for the current language */}
      <p>{product.description.find((d) => d.lang === lang)!.value}</p>

      {/* Product variant selector for colors and sizes */}
      <ProductVariantSelector
        colors={colors}
        sizes={sizes}
        lang={lang}
        product={product}
        variantId={variantId === 'undefined' ? undefined : variantId} // Handle string 'undefined' from URL params
      />
    </article>
  )
}

import { getPrice, locales, type Locale } from '@/lib/i18n'
import type { JsonSchema, Lang, Product, Review } from '@/types'
import { getTranslation } from '@/lib/i18n/server'
import Schema from '@/components/schema'

function calculateAverageRating(reviews: Review[]): { ratingValue: number; reviewCount: number } {
  if (reviews.length === 0) {
    return { ratingValue: 0, reviewCount: 0 }
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  return {
    ratingValue: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    reviewCount: reviews.length,
  }
}

export default function ProductSchema({
  lang,
  locale,
  product,
  reviews = [],
  variantId,
}: {
  lang: Lang
  locale: Locale
  product: Product
  reviews?: Review[]
  variantId?: string
}) {
  const { price: localizedPrice } = getPrice({ locale, price: product.price })
  const currency = locales[locale].currency

  // Get translated product type
  const translatedType = getTranslation({ key: `types.${product.type}`, lang }) || product.type

  // Get product description in the current language
  const description = product.description.find((d) => d.lang === lang)?.value || product.description[0]?.value || ''

  // Calculate review statistics
  const { ratingValue, reviewCount } = calculateAverageRating(reviews)

  // Build the product URL
  const productUrl = `https://ship-shop.vercel.app/products/${product.slug}`

  // Create offers array for all variants
  const offers = product.variants.map((variant) => {
    const availability = variant.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

    return {
      '@type': 'Offer',
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      price: localizedPrice.toString(),
      priceCurrency: currency,
      sku: variant.key,
      url: `${productUrl}?variantId=${variant.id}`,
    }
  })

  const schema: JsonSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': productUrl,
        name: `${product.title} ${translatedType}`,
        description,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'Ship/Shop',
        },
        keywords: product.keywords,
        offers,
        ...(reviewCount > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue,
            Count: reviewCount,
          },
        }),
        url: productUrl,
      },
    ],
  }

  return <Schema id="product-schema" schema={schema} schemaKey={`product-${product.id}-${variantId || 'default'}`} />
}

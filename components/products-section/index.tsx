import type { Lang, ListProduct as ListProductType } from '@/types'
import { getCurrencySymbol, type Locale } from '@/lib/i18n'
import Link from '../link'
import ListProduct from '../list-product'
import { Suspense } from 'react'

/**
 * Title subcomponent that renders section headings
 * Supports internationalization and optional linking
 */
function Title({
  lang,
  link,
  title,
}: {
  lang: Lang
  link?: string // Optional URL to make the title clickable
  title: {
    en: string
    es?: string // Spanish translation is optional, falls back to English
  }
}) {
  // Get the title in the current language, fallback to English if not available
  const titleString = title[lang] ?? title['en']

  return (
    <h2>
      {link ? (
        // Render as a clickable link if URL is provided
        <Link className="text-[aquamarine]" href={link}>
          {titleString}
        </Link>
      ) : (
        // Render as plain text if no link is provided
        titleString
      )}
    </h2>
  )
}

/**
 * Async render component that handles the actual product list rendering
 * Separated to work properly with React Suspense boundaries
 */
async function Render({
  lang,
  locale,
  promise,
}: {
  lang: Lang
  locale: Locale
  promise: Promise<{ products: ListProductType[] }>
}) {
  // Await the promise to get the actual product data
  const { products } = await promise

  return (
    <>
      {/* Render each product using the ListProduct component */}
      {products.map((product) => {
        return <ListProduct key={product.id} lang={lang} locale={locale} product={product} />
      })}
    </>
  )
}

/**
 * Main products section component that displays a list of products
 * with optional title, loading states, and internationalization support
 *
 * Uses React Suspense to show loading placeholders while data is being fetched
 */
export default async function ProductsSection({
  className,
  lang,
  length = 3,
  link,
  locale,
  promise,
  title,
}: {
  className?: string
  lang: Lang
  length?: number
  link?: string
  locale: Locale
  promise: Promise<{ products: ListProductType[] }>
  title?: {
    // Optional section title with internationalization
    en: string
    es?: string
  }
}) {
  // Early return if no promise is provided
  if (!promise) {
    return null
  }

  // Get the appropriate currency symbol for the current locale
  const currencySymbol = getCurrencySymbol({ locale })

  return (
    <section className={`grid grid-cols-1 gap-4 ${className ?? ''}`}>
      {/* Render section title if provided */}
      {!!title && <Title lang={lang} link={link} title={title} />}

      {/* Suspense boundary with loading fallback */}
      <Suspense
        fallback={
          <>
            {/* Generate placeholder loading items based on expected length */}
            {[...new Array(length)].map((_, index) => (
              <ul key={index}>
                {/* Placeholder product title */}
                <li className="text-[darkslategray]">Product Title</li>
                {/* Placeholder price with currency symbol */}
                <li className="text-[darkslategray]">{currencySymbol}</li>
              </ul>
            ))}
          </>
        }
      >
        {/* Actual product rendering component */}
        <Render lang={lang} locale={locale} promise={promise} />
      </Suspense>
    </section>
  )
}

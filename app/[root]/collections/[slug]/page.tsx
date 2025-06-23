import { getRootParams, parseRoot } from '@/lib/flags/server'
import { getCollection } from '@/lib/collections/server'
import { getProductsByCollection } from '@/lib/products/server'
import ListProduct from '@/components/list-product'
import type { Metadata } from 'next'
import NoProductsMessage from '@/components/collections/no-products-message'
import CollectionHeader from '@/components/collections/header'

/**
 * Generate metadata for the collection page based on the collection's localized content
 * This enables proper SEO with translated titles and descriptions
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { lang } = await parseRoot()

  // Fetch collection data to get localized metadata
  const { collection } = await getCollection({ slug })

  return {
    // Find description in current language, fallback handled by Next.js
    description: collection.description.find((d) => d.lang === lang)?.value,
    // Find title in current language, fallback handled by Next.js
    title: collection.title.find((t) => t.lang === lang)?.value,
  }
}

/**
 * Generate static params for all possible root combinations
 * This enables static generation at build time for better performance
 */
export async function generateStaticParams() {
  return await getRootParams()
}

/**
 * Collection page component that displays a collection header and its associated products
 *
 * Features:
 * - Dynamic routing based on collection slug
 * - Internationalized content
 * - Parallel data fetching for performance
 * - Conditional rendering based on product availability
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { lang, locale } = await parseRoot()

  // Fetch collection and products data in parallel for better performance
  const [{ collection }, { products }] = await Promise.all([getCollection({ slug }), getProductsByCollection({ slug })])

  return (
    <section className="grid grid-cols-1 gap-8">
      {/* Collection header with title, description, and other metadata */}
      <CollectionHeader collection={collection} lang={lang} />

      {/* Conditional rendering based on whether products exist in this collection */}
      {products.length > 0 ? (
        // Render product grid when products are available
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => {
            return <ListProduct key={product.id} lang={lang} locale={locale} product={product} />
          })}
        </div>
      ) : (
        // Show empty state message when no products are found
        <NoProductsMessage />
      )}
    </section>
  )
}

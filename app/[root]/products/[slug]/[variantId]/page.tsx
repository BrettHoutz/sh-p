import { getFaqs, getProduct, getSimilarProducts } from '@/lib/products/server'
import { getRootParams, parseRoot } from '@/lib/flags/server'
import type { CSSProperties } from 'react'
import { getReviews } from '@/lib/reviews/server'
import type { Metadata } from 'next'
import ProductDetail from '@/components/product-detail'
import ProductFaqs from '@/components/product-faqs'
import ProductReviews from '@/components/product-reviews'
import ProductSchema from '@/components/product-schema'
import ProductsSection from '@/components/products-section'

/**
 * Generate metadata for the product page based on the product's localized content
 * This enables proper SEO with translated descriptions and product titles
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { lang } = await parseRoot()

  // Fetch product data to get localized metadata
  const { product } = await getProduct({ slug })

  return {
    // Find description in current language, fallback handled by Next.js
    description: product.description.find((d) => d.lang === lang)?.value,
    // Product title is not localized, use as-is
    title: product.title,
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
 * Product detail page component that displays comprehensive product information
 *
 * Features:
 * - Dynamic routing with product slug and variant ID
 * - Internationalized content
 * - Parallel data fetching for performance
 * - Dynamic section ordering based on traffic source (paid vs organic)
 * - Structured data for SEO
 * - Product variants (colors/sizes) processing
 */
export default async function Page({ params }: { params: Promise<{ slug: string; variantId: string }> }) {
  const { slug, variantId } = await params
  const { lang, locale, medium, showDemoMode } = await parseRoot()

  // Fetch all product-related data in parallel for optimal performance
  const [{ faqs }, { product }, { reviews }] = await Promise.all([
    getFaqs({ slug }), // Product-specific FAQs
    getProduct({ slug }), // Main product data
    getReviews({ slug }), // Customer reviews
  ])

  // Extract unique colors and sizes from product variants for selector components
  const colors = Array.from(new Set(product.variants.map((v) => v.color))).sort()
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)))

  return (
    <>
      {/* Structured data for search engines (JSON-LD schema) */}
      <ProductSchema
        lang={lang}
        locale={locale}
        product={product}
        reviews={reviews}
        variantId={variantId === 'undefined' ? undefined : variantId}
      />

      {/* Main product page layout with dynamic section ordering */}
      <section
        className="grid grid-cols-1 gap-y-8"
        style={
          {
            // Dynamic CSS custom properties for section ordering based on traffic source
            // Paid traffic users see reviews and related products higher up
            '--order-faqs': medium === 'paid' ? 4 : 3, // FAQs: lower priority for paid traffic
            '--order-related': medium === 'paid' ? 2 : 4, // Related products: higher priority for paid traffic
            '--order-reviews': medium === 'paid' ? 3 : 2, // Reviews: moderate priority for paid traffic
          } as CSSProperties
        }
      >
        {/* Main product information and variant selector (always first) */}
        <ProductDetail
          colors={colors}
          lang={lang}
          locale={locale}
          medium={medium}
          product={product}
          showDemoMode={showDemoMode}
          sizes={sizes}
          variantId={variantId === 'undefined' ? undefined : variantId} // Handle string 'undefined' from URL
        />

        {/* Customer reviews section with dynamic ordering */}
        <ProductReviews lang={lang} reviews={reviews} slug={slug} />

        {/* Frequently asked questions section with dynamic ordering */}
        <ProductFaqs faqs={faqs} lang={lang} />

        {/* Related/similar products section with dynamic ordering */}
        <ProductsSection
          className="order-(--order-related)"
          lang={lang}
          length={3}
          locale={locale}
          promise={getSimilarProducts({ slug })} // Async promise for similar products
          title={{ en: 'Customers Also Loved', es: 'A las Clientes También les Gustó' }}
        />
      </section>
    </>
  )
}

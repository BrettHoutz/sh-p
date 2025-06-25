import { getRootParams, parseRoot } from '@/lib/flags/server'
import { getProductsByCollection } from '@/lib/products/server'
import type { Metadata } from 'next'
import PageHeader from '@/components/page-header'
import PersonalizedProducts from '@/components/personalized-products'
import ProductsSection from '@/components/products-section'

// Internationalized content object containing hero section text
// Organized by language with title and description for each
const content = {
  en: {
    description:
      'Discover premium products crafted for quality and style. Shop our exclusive collection with fast shipping, easy returns, and exceptional customer service guaranteed.',
    title: 'Premium Products For The DU Fam',
  },
  es: {
    description:
      'Descubre productos premium elaborados para calidad y estilo. Compra nuestra colección exclusiva con envío rápido, devoluciones fáciles y servicio al cliente excepcional garantizado.',
    title: 'Productos Premium Para Tu Estilo de Vida',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await parseRoot()

  return {
    description: content[lang].description,
    title: content[lang].title,
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
 * Homepage component that serves as the main landing page
 *
 * Features:
 * - Internationalized hero content
 * - Multiple product sections (best sellers, new arrivals)
 * - SEO-optimized content structure
 * - Responsive design with consistent spacing
 */
export default async function Page() {
  const { lang, locale } = await parseRoot()

  // Select the appropriate content based on the current language
  // Defaults to English if the language is not Spanish
  const { title, description } = lang === 'es' ? content.es : content.en

  return (
    <section className="grid grid-cols-1 gap-8">
      {/* Hero section with internationalized title and description */}
      <PageHeader title={title} description={description} />

      {/* Best sellers product section */}
      <ProductsSection
        lang={lang}
        length={5} // Number of placeholder items while loading
        link="/collections/best-seller" // Link to full collection page
        locale={locale}
        promise={getProductsByCollection({ slug: 'best-seller' })} // Async data fetching
        title={{ en: 'Shop Best Sellers', es: 'Compra los más Vendidos' }}
      />

      {/* New arrivals product section */}
      <ProductsSection
        lang={lang}
        length={5} // Number of placeholder items while loading
        link="/collections/new-arrival" // Link to full collection page
        locale={locale}
        promise={getProductsByCollection({ slug: 'new-arrival' })} // Async data fetching
        title={{ en: 'Shop New Arrivals', es: 'Compra Novedades' }}
      />

      <PersonalizedProducts lang={lang} locale={locale} />
    </section>
  )
}

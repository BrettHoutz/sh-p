import type { Lang, ListProduct } from '@/types'
import { cookies } from 'next/headers'
import { getSimilarProducts } from '@/lib/products/server'
import { getTranslation } from '@/lib/i18n/server'
import type { Locale } from '@/lib/i18n'
import ProductsSection from '../products-section'
import { Suspense } from 'react'
import { titleCase } from '@/lib/util'

async function Render({ lang, locale }: { lang: Lang; locale: Locale }) {
  const recentPurchase = (await cookies()).get('recent-purchase')

  if (!recentPurchase) {
    return null
  }

  const product = JSON.parse(recentPurchase.value) as ListProduct
  const productType = getTranslation({ key: `types.${product.type}`, lang })!

  return (
    <ProductsSection
      lang={lang}
      length={3}
      locale={locale}
      promise={getSimilarProducts({ slug: product.slug })}
      title={{
        en: `Because you bought ${product.title} ${titleCase(productType)}`,
        es: `Porque compraste ${product.title} ${titleCase(productType)}`,
      }}
    />
  )
}

export default async function PersonalizedProducts({ lang, locale }: { lang: Lang; locale: Locale }) {
  return (
    <Suspense>
      <Render lang={lang} locale={locale} />
    </Suspense>
  )
}

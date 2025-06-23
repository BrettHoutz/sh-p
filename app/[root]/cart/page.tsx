import { getRootParams, parseRoot } from '@/lib/flags/server'
import Cart from '@/components/cart'
import { getTranslation } from '@/lib/i18n/server'

export async function generateStaticParams() {
  return await getRootParams()
}

export default async function Page() {
  const { lang, locale } = await parseRoot()

  return (
    <section className="grid grid-cols-1 gap-4">
      <h1>{getTranslation({ lang, key: 'cartTitle' }) || 'Shopping Cart'}</h1>
      <Cart lang={lang} locale={locale} />
    </section>
  )
}

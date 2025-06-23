import { cookies } from 'next/headers'
import CartCheckoutButton from './checkout-button'
import CartProductList from './product-list'
import { getCart } from '@/lib/products/server'
import type { Lang } from '@/types'
import type { Locale } from '@/lib/i18n'
import EmptyCart from './empty-cart'
import { sanitizeProducts } from '@/lib/products/server'
import { Suspense } from 'react'

async function Render({ lang, locale }: { lang: Lang; locale: Locale }) {
  // Get the cart cookie
  const cartCookie = (await cookies()).get('cart')

  // Check if cart exists and has items
  let hasItems = false
  let cartItems: Array<{ productId: string; variantId: string }> = []

  if (cartCookie?.value) {
    try {
      const cart = JSON.parse(cartCookie.value)
      hasItems = Array.isArray(cart.items) && cart.items.length > 0

      // Extract cart items with product and variant IDs
      if (hasItems) {
        cartItems = cart.items.map((item: { productId: string; variantId: string }) => ({
          productId: item.productId,
          variantId: item.variantId,
        }))
      }
    } catch (error) {
      console.error('Failed to parse cart cookie:', error)
    }
  }

  // If cart has items, get the products
  if (hasItems) {
    const { products } = await getCart()

    return (
      <div className="grid grid-cols-1 gap-4">
        <CartProductList products={products} cartItems={cartItems} lang={lang} locale={locale} />
        <div>
          <CartCheckoutButton product={sanitizeProducts(products)[0]} />
        </div>
      </div>
    )
  }

  // If cart is empty or doesn't exist
  return <EmptyCart lang={lang} />
}

export default function Cart({ lang, locale }: { lang: Lang; locale: Locale }) {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <Render lang={lang} locale={locale} />
    </Suspense>
  )
}

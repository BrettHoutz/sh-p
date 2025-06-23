import type { Lang, Product } from '@/types'
import CartProductItem from '@/components/cart/product-item'
import type { Locale } from '@/lib/i18n'

type CartItem = {
  productId: string
  variantId: string
}

export default function CartProductList({
  products,
  cartItems,
  lang,
  locale,
}: {
  products: Product[]
  cartItems: CartItem[]
  lang: Lang
  locale: Locale
}) {
  return (
    <div>
      {products.map((product) => {
        // Find the matching cart item to get the variant ID
        const cartItem = cartItems.find((item) => item.productId === product.id)
        const variantId = cartItem?.variantId || ''

        return <CartProductItem key={product.id} product={product} variantId={variantId} lang={lang} locale={locale} />
      })}
    </div>
  )
}

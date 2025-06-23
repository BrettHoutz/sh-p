'use client'

import { useCart } from '@/lib/cart/client'
import { addToCart } from '@/lib/cart/actions'

export default function AddToCartClient({
  productId,
  quantity,
  variantId,
  addToCartText,
  addingText,
}: {
  productId: string
  quantity: number
  variantId: string
  addToCartText: string
  addingText: string
}) {
  const { updateCart, isProcessing } = useCart()

  const handleAddToCart = async () => {
    try {
      // First, update the cart state to show processing
      await updateCart({ isProcessing: true })

      // Call the server action with the provided productId and variantId
      const cart = await addToCart(productId, variantId, quantity)

      // Update the cart state with the new cart length
      await updateCart({
        isProcessing: false,
        length: cart.items.length,
      })
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      // Reset the processing state in case of error
      await updateCart({ isProcessing: false })
    }
  }

  return (
    <button
      className="text-(--color-add-to-cart) disabled:cursor-not-allowed disabled:text-[gray]"
      onClick={handleAddToCart}
      disabled={isProcessing}
    >
      {isProcessing ? addingText : addToCartText}
    </button>
  )
}

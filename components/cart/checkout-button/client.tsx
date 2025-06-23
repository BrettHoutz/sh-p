'use client'

import { completeCart } from '@/lib/cart/actions'
import type { ListProduct } from '@/types'
import { useCart } from '@/lib/cart/client'
import { useState } from 'react'

export default function CartCheckoutButtonClient({ product }: { product: ListProduct }) {
  const { updateCart } = useCart()
  const [isCompleting, setIsCompleting] = useState(false)

  const handleResetCart = async () => {
    try {
      // Set resetting state
      setIsCompleting(true)

      // First, update the cart state to show processing
      await updateCart({ isProcessing: true })

      // Call the server action to reset the cart
      await completeCart({ product })

      // Update the cart state with length 0
      await updateCart({
        isProcessing: false,
        length: 0,
      })
    } catch (error) {
      // Reset the processing state in case of error
      await updateCart({ isProcessing: false })
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <button
      className="cursor-pointer text-(--color-add-to-cart) disabled:cursor-not-allowed disabled:text-[gray]"
      onClick={handleResetCart}
      disabled={isCompleting}
    >
      {isCompleting ? 'Completing...' : 'Checkout'}
    </button>
  )
}

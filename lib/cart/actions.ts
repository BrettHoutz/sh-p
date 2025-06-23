'use server'

import { COOKIE_CONFIG } from '../util/server'
import { cookies } from 'next/headers'
import type { ListProduct } from '@/types'
import { nanoid } from 'nanoid'
import { track } from '@vercel/analytics/server'

type CartItem = {
  productId: string
  variantId: string
  quantity: number
}

type Cart = {
  id: string
  items: CartItem[]
}

/**
 * Adds an item to the cart or increases quantity if the same product/variant already exists
 * @param productId The product ID to add to the cart
 * @param variantId The variant ID to add to the cart
 * @param quantity The quantity to add (defaults to 1)
 * @returns The complete cart object
 */
export async function addToCart(productId: string, variantId: string, quantity: number = 1): Promise<Cart> {
  // Get the current cart from cookies
  const cartCookie = (await cookies()).get('cart')
  let cart: Cart = { id: nanoid(), items: [] }

  // Parse existing cart if it exists
  if (cartCookie?.value) {
    try {
      cart = JSON.parse(cartCookie.value) as Cart

      // Ensure items array exists
      if (!Array.isArray(cart.items)) {
        cart.items = []
      }
    } catch (error) {
      console.error('Failed to parse cart cookie:', error)
    }
  }

  // Check if this product/variant combination already exists in the cart
  const existingItemIndex = cart.items.findIndex((item) => item.productId === productId && item.variantId === variantId)

  if (existingItemIndex >= 0) {
    // If the item already exists, increase its quantity
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // Otherwise, add a new item
    cart.items.push({
      productId,
      variantId,
      quantity,
    })
  }

  // Save the updated cart back to cookies
  ;(await cookies()).set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  // Track the add to cart event with Vercel Analytics
  await track('Add to Cart', {
    productId,
    variantId,
    quantity,
    cartItemCount: cart.items.length,
    isExistingItem: existingItemIndex >= 0,
  })

  // Return the complete cart
  return cart
}

/**
 * Deletes the cart cookie, effectively resetting the cart
 * @returns Empty cart object
 */
export async function completeCart({ product }: { product: ListProduct }): Promise<Cart> {
  ;(await cookies()).delete('cart')
  ;(await cookies()).set('recent-purchase', JSON.stringify(product), COOKIE_CONFIG)

  // Return an empty cart
  return { id: nanoid(), items: [] }
}

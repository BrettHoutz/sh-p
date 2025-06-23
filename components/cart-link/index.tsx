import CartLinkClient from './client'
import { cookies } from 'next/headers'
import { getTranslation } from '@/lib/i18n/server'
import type { Lang } from '@/types'
import Link from '../link'
import { Suspense } from 'react'
import { titleCase } from '@/lib/util'

// Server component to get cart item count from cookies
async function Indicator() {
  const cart = (await cookies()).get('cart')

  let length = 0

  // Parse cart cookie to get item count
  if (cart?.value) {
    const parsed = JSON.parse(cart.value)
    length = (parsed.items ?? []).length
  }

  return <CartLinkClient length={length} />
}

// Cart link with item count indicator
export default async function Cart({ lang }: { lang: Lang }) {
  const cart = getTranslation({ key: 'cart', lang })

  return (
    <Link className="flex items-center text-[dodgerblue]" href="/cart">
      <span>{titleCase(cart!)}</span>
      {/* Suspense for cart count with fallback */}
      <Suspense fallback={<span className="font-mono opacity-0">0</span>}>
        <Indicator />
      </Suspense>
    </Link>
  )
}

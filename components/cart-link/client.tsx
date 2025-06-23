'use client'

import { useCart } from '@/lib/cart/client'
import { useEffect } from 'react'

function numberToSuperscript(num: number): string {
  // Convert number to string to handle multi-digit numbers
  const numStr = num.toString()

  // Map of digits to their superscript equivalents
  const superscriptMap: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  }

  // Convert each digit to its superscript equivalent
  return numStr
    .split('')
    .map((digit) => superscriptMap[digit] || digit)
    .join('')
}

export default function CartLinkClient({ length }: { length: number }) {
  const { leader, length: cartLength, lengthHasChanged } = useCart()

  useEffect(() => {
    leader({ length })
  }, [])

  return (
    <span className="font-mono" data-is-ready={!!length && length > 0}>
      {numberToSuperscript(Number.isInteger(length) ? (lengthHasChanged ? cartLength : length) : 0)}
    </span>
  )
}

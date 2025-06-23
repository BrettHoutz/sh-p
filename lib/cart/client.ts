'use client'

import useSWR from 'swr'

// Cart state shape
// isProcessing: if cart is being updated
// length: number of items
// lengthHasChanged: if cart length changed since last check
type FallbackData = {
  isProcessing: boolean
  length: number
  lengthHasChanged: boolean
}

// Client-side cart hook for state and updates
export function useCart(key: string = 'cart') {
  // Default cart state
  const fallbackData = {
    isProcessing: false,
    length: 0,
    lengthHasChanged: false,
  } as FallbackData

  // SWR for cart state, disables auto revalidation
  const { data, mutate } = useSWR(key, () => fallbackData, {
    fallbackData,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  // Set cart length as leader (for multi-tab sync)
  async function leader({ length }: { length: number }) {
    await updateCart({ length })
  }

  // Update cart state with new data
  async function updateCart({ ...newData }: Partial<FallbackData>) {
    const mutated = { ...data, ...newData }
    mutate(mutated, { revalidate: false })
  }

  // Expose helpers and cart state
  return {
    leader,
    updateCart,
    ...data,
  }
}

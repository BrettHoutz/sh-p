'use client'

import type { ListProduct as ListProductType } from '@/types'
import { refreshProduct } from '@/lib/products/action'

// Client component for refreshing product data
export default function ListProductRefresh({ product }: { product: ListProductType }) {
  return (
    <button
      className="text-[darkslategray] hover:text-[slategray]"
      onClick={async () => {
        // Refresh product data via server action
        await refreshProduct({ slug: product.slug })

        // Reload page to show updated data
        window.location.reload()
      }}
    >
      Refresh
    </button>
  )
}

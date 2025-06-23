'use client'

import { useState, useEffect } from 'react'
import type { Color, ProductSize } from '@/types'
import AddToCart from '@/components/add-to-cart'

// Color with its translated name
type ColorTranslation = {
  color: Color
  translation: string
}

// Product variant data structure
type ProductVariantData = {
  id: string
  color: Color
  size: ProductSize
}

// Client component for selecting product variants (color/size)
export default function ProductVariantSelectorClient({
  colorTranslations,
  sizes,
  productId,
  variants,
  colorLabel,
  sizeLabel,
  addToCartText,
  addingText,
  variantId,
}: {
  colorTranslations: ColorTranslation[]
  sizes: ProductSize[]
  productId: string
  variants: ProductVariantData[]
  colorLabel: string
  sizeLabel: string
  addToCartText: string
  addingText: string
  variantId: string | undefined
}) {
  const colors = colorTranslations.map((ct) => ct.color)

  // Track if user has interacted (for URL updates)
  const [hasClicked, setHasClicked] = useState(false)

  // Initialize with current variant or first available
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    variants.find((pv) => pv.id === variantId)?.color ?? (colors.length > 0 ? colors[0] : null),
  )
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    variants.find((pv) => pv.id === variantId)?.size ?? (sizes.length > 0 ? sizes[0] : null),
  )
  const [selectedVariant, setSelectedVariant] = useState<string | null>(variantId ?? null)

  // Find matching variant when color or size changes
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = variants.find((v) => v.color === selectedColor && v.size === selectedSize)

      if (variant) {
        setSelectedVariant(variant.id)
      }
    }
  }, [selectedColor, selectedSize, variants])

  // Update URL with selected variant (only after user interaction)
  useEffect(() => {
    if (!selectedVariant || !hasClicked) return

    // Build new URL with variantId param
    const currentUrl = new URL(window.location.href)
    const params = new URLSearchParams(currentUrl.search)

    params.set('variantId', selectedVariant)

    // Update URL without page refresh
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }, [hasClicked, selectedVariant])

  return (
    <div className="grid grid-cols-1 gap-y-8">
      {/* Color selector */}
      {colors.length > 0 && (
        <div className="grid grid-cols-1">
          <h3>{colorLabel}</h3>
          <div className="flex flex-wrap gap-4">
            {colorTranslations.map(({ color, translation }) => (
              <button
                key={color}
                className={`cursor-pointer text-[slategray] first-letter:uppercase data-[selected=true]:text-[lightgray]`}
                data-selected={selectedColor === color}
                onClick={() => {
                  setHasClicked(true)
                  setSelectedColor(color)
                }}
              >
                {translation}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {sizes.length > 0 && (
        <div className="grid grid-cols-1">
          <h3>{sizeLabel}</h3>
          <div className="flex flex-wrap gap-4">
            {sizes.map((size) => (
              <button
                key={size}
                className={`cursor-pointer text-[slategray] uppercase data-[selected=true]:text-[lightgray]`}
                data-selected={selectedSize === size}
                onClick={() => {
                  setHasClicked(true)
                  setSelectedSize(size)
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart button (only when variant selected) */}
      {selectedVariant && (
        <div>
          <AddToCart
            productId={productId}
            variantId={selectedVariant}
            quantity={1}
            addToCartText={addToCartText}
            addingText={addingText}
          />
        </div>
      )}
    </div>
  )
}

import type { Color, Lang, Product, ProductSize } from '@/types'
import ProductVariantSelectorClient from './client'
import { getTranslation } from '@/lib/i18n/server'

export default function ProductVariantSelector({
  colors,
  sizes,
  lang,
  product,
  variantId,
}: {
  colors: Color[]
  sizes: ProductSize[]
  lang: Lang
  product: Product
  variantId: string | undefined
}) {
  // Get translations for each color
  const colorTranslations = colors.map((color) => ({
    color,
    translation: getTranslation({ key: `colors.${color}`, lang }) || color,
  }))

  // Get translations for the labels
  const colorLabel = getTranslation({ key: 'chooseProductColor', lang }) || 'Choose a Color'
  const sizeLabel = getTranslation({ key: 'chooseProductSize', lang }) || 'Choose a Size'

  // Get translations for the Add to Cart button
  const addToCartText = getTranslation({ key: 'addToCart', lang }) || 'Add to Cart'
  const addingText = getTranslation({ key: 'adding', lang }) || 'Adding...'

  // Extract only the necessary variant data
  const variants = product.variants.map((variant) => ({
    id: variant.id,
    color: variant.color,
    size: variant.size,
  }))

  return (
    <ProductVariantSelectorClient
      colorTranslations={colorTranslations}
      sizes={sizes}
      productId={product.id}
      variants={variants}
      colorLabel={colorLabel}
      sizeLabel={sizeLabel}
      addToCartText={addToCartText}
      addingText={addingText}
      variantId={variantId ?? (product.variants.find((v) => v.isPrimary)?.id || product.variants[0].id)}
    />
  )
}

import AddToCartClient from './client'

export default function AddToCart({
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
  return (
    <AddToCartClient
      productId={productId}
      quantity={quantity}
      variantId={variantId}
      addToCartText={addToCartText}
      addingText={addingText}
    />
  )
}

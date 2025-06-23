import type { Faq, ListProduct, Product } from '@/types'
import { getEmbeddingsFromFile, getFaqsFromFile, getProductsFromFile } from '../edge-config/server'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { alphabeticalDistance } from '../util'

/**
 * Array of premium prefixes for athleisure product naming
 */
export const productPrefixes = [
  'Aero',
  'Algo',
  'Amp',
  'Apex',
  'Aura',
  'Axis',
  'Bliss',
  'Boost',
  'Cloud',
  'Core',
  'Cryo',
  'Drift',
  'Echo',
  'Edge',
  'Ether',
  'Flex',
  'Flow',
  'Flux',
  'Force',
  'Fusion',
  'Glide',
  'Halo',
  'Hyper',
  'Kinetic',
  'Loft',
  'Luma',
  'Max',
  'Meta',
  'Mist',
  'Neo',
  'Nova',
  'Orbit',
  'Peak',
  'Phantom',
  'Prism',
  'Pulse',
  'Quantum',
  'Rapid',
  'Realm',
  'Revive',
  'Sage',
  'Shift',
  'Sonic',
  'Spark',
  'Stride',
  'Swift',
  'Sync',
  'Tempo',
  'Volt',
  'Zenith',
]

/**
 * Calculates cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  // Calculate dot product
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)

  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))

  // Calculate cosine similarity
  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Gets products that are in the user's cart
 * @returns Array of products that are in the cart
 */
export async function getCart(): Promise<{ id: string; products: Product[] }> {
  // Get the cart cookie
  const cartCookie = (await cookies()).get('cart')

  // If no cart cookie exists, return empty array
  if (!cartCookie?.value) {
    return { id: '', products: [] }
  }

  // Parse the cart cookie
  const cart = JSON.parse(cartCookie.value)

  // If no items in cart, return empty array
  if (!Array.isArray(cart.items) || cart.items.length === 0) {
    return { id: cart.id, products: [] }
  }

  // Extract product IDs from cart items
  const cartProductIds = cart.items
    .map((item: { productId: string }) => item.productId)
    .sort((a: string, b: string) => a.localeCompare(b))

  const { products } = await getCartProducts({ cartProductIds })

  return { id: cart.id, products }
}

// Fetches products matching the given cartProductIds, applies caching and tagging
async function getCartProducts({ cartProductIds }: { cartProductIds: string[] }): Promise<{ products: Product[] }> {
  'use cache: remote'

  // Cache this result indefinitely
  unstable_cacheLife('max')

  // Get all products, filter to those in the cart
  const products = await getProductsFromFile().then((res) =>
    res.filter((product) => cartProductIds.includes(product.id)),
  )

  // Tag cache for each product in the cart
  unstable_cacheTag('products', ...products.map((product) => `product-${product.slug}`))

  // Return products in RORO pattern
  return { products }
}

/**
 * Gets up to 3 FAQs most relevant to the given slug, sorted by alphabetical similarity.
 */
export async function getFaqs({ slug }: { slug: string }): Promise<{ faqs: Faq[] }> {
  const faqs = await getFaqsFromFile().then((res) =>
    res
      .sort(
        (a, b) =>
          alphabeticalDistance({ a: slug, b: a.answer[0].value }).distance -
          alphabeticalDistance({ a: slug, b: b.answer[0].value }).distance,
      )
      .slice(0, 3),
  )

  return { faqs }
}

/**
 * Retrieves all products associated with a given collection slug.
 * Applies product sanitization, indefinite caching, and cache tagging.
 * @param slug - The collection slug to filter products by
 * @returns Object containing array of products in the collection
 */
async function _getProductsByCollection({ slug }: { slug: string }) {
  'use cache: remote'

  // Cache this result indefinitely
  unstable_cacheLife('max')

  // Get all products, filter by collection slug, then sanitize
  const products = await getProductsFromFile().then((res) =>
    sanitizeProducts(res.filter((product) => product.keywords.includes(slug))),
  )

  // Tag cache for this collection and each product in it
  unstable_cacheTag('products', `collection-${slug}`, ...products.map((product) => `product-${product.slug}`))

  // Return products in RORO pattern
  return { products }
}

/**
 * Returns up to `length` products for a given collection slug.
 */
export async function getProductsByCollection({ slug, length = 5 }: { slug: string; length?: number }) {
  const { products } = await _getProductsByCollection({ slug })

  return { products: products.slice(0, length) }
}

/**
 * Gets a product by its slug
 * @param options Object containing slug
 * @param options.slug The slug of the product to retrieve
 * @returns The product object if found
 * @throws notFound() if the product doesn't exist
 */
export async function getProduct({ slug }: { slug: string }): Promise<{ product: Product }> {
  'use cache: remote'

  unstable_cacheLife('max')

  const product = await getProductsFromFile().then((res) => res.find((product) => product.slug === slug))

  unstable_cacheTag('products', `product-${slug}`)

  if (!product) {
    notFound()
  }

  return { product }
}

/**
 * Returns up to 3 products most similar to the given slug.
 * Uses OpenAI embeddings if available, otherwise returns a random selection.
 */
async function _getSimilarProducts({ slug }: { slug: string }) {
  const products = await getProductsFromFile()
  const targetProduct = products.find((product) => product.slug === slug)

  if (!targetProduct) {
    return []
  }

  const embeddings = await getEmbeddingsFromFile()

  // Find the embedding for the target product
  const targetEmbedding = embeddings.find((emb) => emb.id === targetProduct.id)?.embedding

  // Calculate similarity scores for all products compared to the target
  const similarities = embeddings
    .filter((emb) => emb.id !== targetProduct.id) // Exclude the target product
    .map((emb) => ({
      id: emb.id,
      similarity: cosineSimilarity(targetEmbedding!, emb.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity) // Sort by similarity (descending)
    .slice(0, 3) // Take top 3

  return sanitizeProducts(
    similarities
      .map((sim) => {
        const product = products.find((p) => p.id === sim.id)

        return product
      })
      .filter((product) => !!product),
  )
}

export async function getSimilarProducts({ slug }: { slug: string }): Promise<{ products: ListProduct[] }> {
  'use cache: remote'

  unstable_cacheLife('max')

  const products = await _getSimilarProducts({ slug })

  unstable_cacheTag('products', `similar-products-${slug}`, ...products.map((product) => `product-${product.slug}`))

  return { products }
}

// Returns an array of products with only the fields needed for ListProduct
// Strips extra fields from Product objects
export function sanitizeProducts(products: Product[]) {
  return products.map((product) => ({
    compareAtPrice: product.compareAtPrice,
    id: product.id,
    price: product.price,
    slug: product.slug,
    title: product.title,
    type: product.type,
  })) as ListProduct[]
}

import 'server-only'
import type { Collection, Embedding, Faq, Product, Review } from '@/types'
import { readFile, writeFile } from 'node:fs/promises'
import collectionsData from '@/data/collections.json'
import embeddingsData from '@/data/embeddings.json'
import faqsData from '@/data/faqs.json'
import { get } from '@vercel/edge-config'
import path from 'node:path'
import reviewsData from '@/data/reviews.json'

/**
 * Retrieves collections data from local JSON file
 * @returns Cloned array of Collection objects to prevent mutations
 */
export async function getCollectionsFromFile() {
  return structuredClone(collectionsData) as Collection[]
}

/**
 * Retrieves embeddings data from local JSON file
 * @returns Cloned array of Embedding objects for vector search
 */
export async function getEmbeddingsFromFile() {
  return structuredClone(embeddingsData) as Embedding[]
}

/**
 * Retrieves FAQ data from local JSON file
 * @returns Cloned array of FAQ objects
 */
export async function getFaqsFromFile() {
  return structuredClone(faqsData) as Faq[]
}

/**
 * Retrieves products data from either Edge Config or local JSON file
 * Falls back to Edge Config if available, otherwise reads from local file
 * @returns Array of Product objects, empty array if error occurs
 */
export async function getProductsFromFile() {
  let products: Product[] = []
  try {
    if (process.env.EDGE_CONFIG) {
      // Fetch from Vercel Edge Config for production
      products = (await get('products')) as Product[]
    } else {
      // Fallback to local file for development
      const fileContents = await readFile(path.join(process.cwd(), 'data', 'products.json'), 'utf8')
      products = JSON.parse(fileContents) as Product[]
    }
  } catch (error) {
    // Silently fail and return empty array
  }

  return products
}

/**
 * Retrieves reviews data from local JSON file
 * @returns Cloned array of Review objects
 */
export async function getReviewsFromFile() {
  return structuredClone(reviewsData) as Review[]
}

/**
 * Parses the Edge Config URL to extract the pathname
 * @returns Pathname portion of the Edge Config URL
 */
export function parseEdgeConfig() {
  return new URL(process.env.EDGE_CONFIG!).pathname
}

/**
 * Updates the embeddings data file with new embedding vectors
 * @param embeddings - Array of objects containing id and embedding vector
 */
export async function setEmbeddings({ embeddings }: { embeddings: { id: string; embedding: number[] }[] }) {
  const filePath = `${process.cwd()}/data/embeddings.json`

  await writeFile(filePath, JSON.stringify(embeddings), 'utf-8')
}

/**
 * Updates the price information for a specific product by slug
 * @param compareAtPrice - Optional original price for comparison
 * @param price - New price for the product
 * @param slug - Product slug to identify the product to update
 */
export async function setProductPrice({
  compareAtPrice,
  price,
  slug,
}: {
  compareAtPrice?: number
  price: number
  slug: string
}) {
  const products = await getProductsFromFile()
  const index = products.findIndex((p) => p.slug === slug)

  if (index > -1) {
    products[index].compareAtPrice = compareAtPrice
    products[index].price = price

    if (process.env.EDGE_CONFIG) {
      // Update Vercel Edge Config in production
      await fetch(
        `https://api.vercel.com/v1/edge-config${
          new URL(process.env.EDGE_CONFIG!).pathname
        }/items?teamId=team_S5XzLRwjjgoSIu8i1giOZOXS`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [
              {
                operation: 'upsert',
                key: 'products',
                value: products,
              },
            ],
          }),
        },
      )
    } else {
      // Update local file in development
      const filePath = `${process.cwd()}/data/products.json`

      await writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8')
    }
  }
}

// Server-side collection utilities
import { getCollectionsFromFile } from '../edge-config/server'
import { notFound } from 'next/navigation'

// Fetch a collection by slug, or trigger 404 if not found
export async function getCollection({ slug }: { slug: string }) {
  // Get all collections and find the one matching the slug
  const collection = await getCollectionsFromFile().then((res) => res.find((collection) => collection.slug === slug))

  // If not found, show 404
  if (!collection) {
    notFound()
  }

  // Return as object for RORO pattern
  return { collection }
}

import 'server-only'
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
import { generateObject } from 'ai'
import { getReviewsFromFile } from '../edge-config/server'
import type { Review } from '@/types'
import { z } from 'zod'

/**
 * Retrieves and filters reviews for a specific product slug
 * Finds reviews that contain the slug in their productSlugs array, then sorts by rating
 * @param slug - Product slug to find matching reviews for
 * @returns Object containing array of matching reviews sorted by rating (highest first)
 */
export async function getReviews({ slug }: { slug: string }): Promise<{ reviews: Review[] }> {
  const reviews = await getReviewsFromFile().then(
    (res) =>
      res
        .filter((review) => review.productSlugs?.includes(slug)) // Filter by productSlugs array
        .sort((a, b) => b.rating - a.rating), // Sort by rating (highest first)
  )

  return { reviews }
}

/**
 * Generates AI-powered summaries of product reviews in multiple languages
 * Uses caching to avoid regenerating summaries for the same set of reviews
 * Focuses exclusively on positive aspects of reviews for marketing purposes
 * @param reviews - Array of Review objects to summarize
 * @returns Object containing English and Spanish summaries (~140 characters each)
 */
export async function summarizeReviews({ reviews, slug }: { reviews: Review[]; slug: string }) {
  'use cache: remote'

  // Cache configuration for performance optimization
  unstable_cacheLife('max') // Cache indefinitely until invalidated

  const { object } = await generateObject({
    model: 'gpt-4.1-mini', // Use AI gateway for model access
    prompt: `Summarize the following reviews, exclusively highlight the positive aspects of the reviews, in roughly 140 characters in english and spanish: ${reviews.map((review) => review.description).join('\n')}`,
    schema: z.object({
      englishSummary: z.string(),
      spanishSummary: z.string(),
    }),
  })

  unstable_cacheTag('reviews', `reviews-${slug}`) // Tag for cache invalidation

  return { en: object.englishSummary, es: object.spanishSummary }
}

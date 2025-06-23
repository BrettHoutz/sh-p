'use server'

import { getReviewsFromFile } from '../edge-config/server'
import { join } from 'path'
import { revalidateTag } from 'next/cache'
import { writeFile } from 'fs/promises'

// Add a product slug to a random review that doesn't already have it
export async function addSlugToRandomReview({ slug }: { slug: string }) {
  try {
    // Get reviews using existing function
    const reviews = await getReviewsFromFile()

    // Find reviews that don't have this slug
    const availableReviews = reviews.filter((review) => !review.productSlugs?.includes(slug))

    // If no available reviews, return early
    if (availableReviews.length === 0) {
      return { success: false, message: 'No available reviews to assign' }
    }

    // Pick a random review
    const randomIndex = Math.floor(Math.random() * availableReviews.length)
    const selectedReview = availableReviews[randomIndex]

    // Find the review in the original array and update it
    const reviewIndex = reviews.findIndex((r) => r.id === selectedReview.id)
    if (reviewIndex !== -1) {
      // Initialize productSlugs if it doesn't exist
      if (!reviews[reviewIndex].productSlugs) {
        reviews[reviewIndex].productSlugs = []
      }
      // Add the slug
      reviews[reviewIndex].productSlugs!.push(slug)
    }

    // Save the updated reviews
    const filePath = join(process.cwd(), 'data', 'reviews.json')
    await writeFile(filePath, JSON.stringify(reviews, null, 2))

    // Invalidate cache
    revalidateTag('reviews')

    return {
      success: true,
      message: `Added slug "${slug}" to review "${selectedReview.title}"`,
      reviewId: selectedReview.id,
    }
  } catch (error) {
    console.error('Error adding slug to review:', error)
    return { success: false, message: 'Failed to update review' }
  }
}

import type { Lang, Review } from '@/types'
import { getTranslation } from '@/lib/i18n/server'
import ProductReviewButton from '../product-review-button'
import { sum } from '@/lib/util'
import { summarizeReviews } from '@/lib/reviews/server'
import { Suspense } from 'react'

/**
 * Renders an AI-powered summary of reviews
 * Falls back to a message about AI_ENABLED if the feature is disabled
 */
async function Render({ lang, reviews, slug }: { lang: Lang; reviews: Review[]; slug: string }) {
  // Default fallback message when AI is not enabled
  let object = {
    en: 'You need access to AI Gateway to use this feature.',
    es: 'Necesitas acceso a AI Gateway para usar esta función.',
  }

  if (
    (!!process.env.VERCEL_OIDC_TOKEN && process.env.NODE_ENV === 'development') ||
    process.env.NODE_ENV === 'production'
  ) {
    try {
      object = await summarizeReviews({ reviews, slug })
    } catch (error) {}
  }

  return <p className="text-[khaki]">{object[lang]}</p>
}

/**
 * Main product reviews component that displays:
 * - Review summary with star ratings and aggregate score
 * - AI-powered review summary (if enabled)
 * - Individual review items
 * - Add review button
 *
 * Handles empty state when no reviews exist
 */
export default function ProductReviews({ lang, reviews, slug }: { lang: Lang; reviews: Review[]; slug: string }) {
  // Handle empty state - show message and review button when no reviews exist
  if (reviews.length === 0) {
    const noReviewsMessage = getTranslation({ lang, key: 'noReviewsYet' })
    return (
      <section className="order-(--order-reviews) grid grid-cols-1 gap-y-4">
        <p className="text-[slategray]">{noReviewsMessage}.</p>
        <ProductReviewButton lang={lang} slug={slug} />
      </section>
    )
  }

  // Calculate aggregate rating (average of all review ratings, rounded to 2 decimal places)
  const aggregate = Math.round((sum(reviews.map((review) => review.rating)) / reviews.length) * 100) / 100

  return (
    <section className="order-(--order-reviews) grid grid-cols-1 gap-y-4">
      <header>
        {/* Star rating display with overlay technique for partial stars */}
        <h2 className="text-[khaki]">
          <span className="relative">
            {/* Background stars (empty/gray) */}
            <span className="text-[darkslategray]">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>★</span>
              ))}
            </span>
            {/* Foreground stars (filled/colored) - width based on aggregate rating */}
            <span className="absolute left-0 z-10 h-full overflow-hidden" style={{ width: `${aggregate * 20}%` }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>★</span>
              ))}
            </span>
          </span>{' '}
          {/* Display aggregate score and review count */}
          {aggregate.toString()}/5 based on {reviews.length} reviews
        </h2>
        {/* AI-powered review summary with loading fallback */}
        <Suspense
          fallback={
            <div className="text-[darkslategray]">
              Rendering a summary of {reviews.length} reviews in {lang === 'en' ? 'English' : 'Spanish'}.
            </div>
          }
        >
          <Render lang={lang} reviews={reviews} slug={slug} />
        </Suspense>
      </header>
      {/* Individual review items */}
      <div className="grid grid-cols-1 gap-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="grid grid-cols-1 text-[bisque]">
            {/* Review header with star rating, title, and reviewer name */}
            <h3>
              {/* Display filled stars based on individual review rating */}
              {Array.from({ length: review.rating }).map((_, index) => (
                <span key={index}>★</span>
              ))}{' '}
              {/* Review title and reviewer name (first name + last initial) */}
              {review.title} - {review.firstName} {review.lastName.charAt(0).toUpperCase()}.
            </h3>
            {/* Review description/content */}
            <p>{review.description}</p>
          </div>
        ))}
      </div>
      {/* Button to add a new review */}
      <ProductReviewButton lang={lang} slug={slug} />
    </section>
  )
}

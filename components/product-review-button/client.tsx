'use client'

import { addSlugToRandomReview } from '@/lib/reviews/actions'

export default function LeaveReviewButtonClient({
  slug,
  leaveReviewText,
  isDisabled,
}: {
  slug: string
  leaveReviewText: string
  isDisabled: boolean
}) {
  // Handle click based on disabled state
  async function handleClick() {
    if (isDisabled) {
      alert('This feature is not available when deployed')
      return
    }

    // Add slug to random review
    await addSlugToRandomReview({ slug })

    // Reload page to show updated data
    window.location.reload()
  }

  return (
    <div>
      <button onClick={handleClick} className="cursor-pointer text-[darkkhaki]">
        {leaveReviewText}
      </button>
    </div>
  )
}

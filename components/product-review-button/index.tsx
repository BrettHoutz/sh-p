import { getTranslation } from '@/lib/i18n/server'
import type { Lang } from '@/types'
import LeaveReviewButtonClient from './client'

export default function LeaveReviewButton({ lang, slug }: { lang: Lang; slug: string }) {
  const leaveReviewText = getTranslation({ lang, key: 'leaveReview' }) || ''
  const isDisabled = !!process.env.VERCEL_URL

  return <LeaveReviewButtonClient slug={slug} leaveReviewText={leaveReviewText} isDisabled={isDisabled} />
}

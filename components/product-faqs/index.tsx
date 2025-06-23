import type { Faq, Lang } from '@/types'
import { getTranslation } from '@/lib/i18n/server'

/**
 * Product FAQs component that displays frequently asked questions
 * Handles internationalization by filtering and displaying content
 * based on the current language preference
 */
export default function ProductFaqs({ faqs, lang }: { faqs: Faq[]; lang: Lang }) {
  // Get the translated heading for "Frequently Asked Questions"
  const faqHeading = getTranslation({ lang, key: 'common.frequentlyAskedQuestions' }) || 'Frequently Asked Questions'

  // Create an array of FAQs with the correct language content
  const localizedFaqs = faqs
    .map((faq) => {
      // Find the question and answer for the current language
      // Each FAQ has multiple language versions stored as arrays
      const questionObj = faq.question.find((q) => q.lang === lang)
      const answerObj = faq.answer.find((a) => a.lang === lang)

      // Transform the multilingual FAQ structure into a simple localized object
      return {
        id: faq.id,
        question: questionObj?.value || '', // Use empty string as fallback
        answer: answerObj?.value || '', // Use empty string as fallback
      }
    })
    .filter((faq) => faq.question && faq.answer) // Filter out any FAQs that don't have content for the current language

  // Don't render anything if no FAQs are available in the current language
  if (localizedFaqs.length === 0) {
    return null
  }

  return (
    <section className="order-(--order-faqs) grid grid-cols-1 gap-y-4">
      {/* Section heading with internationalized text */}
      <h2>{faqHeading}</h2>

      {/* FAQ items container */}
      <div className="grid grid-cols-1 gap-y-4">
        {localizedFaqs.map((faq) => (
          <div key={faq.id} className="grid grid-cols-1">
            {/* FAQ question with distinctive color styling */}
            <h3 className="text-[lightseagreen]">{faq.question}</h3>
            {/* FAQ answer in default text color */}
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

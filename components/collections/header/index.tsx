import type { Collection } from '@/types'
import type { Lang } from '@/types'
import Link from '@/components/link'

export default function CollectionHeader({ collection, lang }: { collection: Collection; lang: Lang }) {
  const description = collection.description.find((d) => d.lang === lang)?.value
  const title = collection.title.find((t) => t.lang === lang)?.value

  return (
    <header className="grid grid-cols-1 gap-4">
      <h1>
        <Link className="text-[aquamarine]" href={`/collections/${collection.slug}`}>
          {title}
        </Link>
      </h1>
      {description && <p>{description}</p>}
    </header>
  )
}

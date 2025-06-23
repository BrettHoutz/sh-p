import type { JsonSchema } from '@/types'

export default function Schema({ id, schema, schemaKey }: { id: string; schema: JsonSchema; schemaKey: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      key={schemaKey}
      id={id}
      type="application/ld+json"
    />
  )
}

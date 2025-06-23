import { translations } from '@/lib/i18n/server'

// Generic any type for flexibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any

// String literal type for boolean values
export type BooleanString = 'true' | 'false'

// Color type derived from translation keys
export type Color = keyof typeof translations.colors

// Collection data structure
export type Collection = {
  description: { lang: Lang; value: string }[]
  slug: string
  title: { lang: Lang; value: string }[]
}

// Demographic type derived from translation keys
export type Demographic = keyof typeof translations.demographics

// Vector embedding for AI/search functionality
export type Embedding = {
  id: string
  embedding: number[]
}

// FAQ data structure with multilingual support
export type Faq = {
  answer: {
    lang: string
    value: string
  }[]
  id: string
  question: {
    lang: string
    value: string
  }[]
}

// JSON-LD schema for structured data/SEO
export type JsonSchema = {
  '@context': string
  '@graph': {
    '@id'?: string
    '@type': string
    aggregateRating?: {
      '@type': string
      Count: number
      ratingValue: number | string
    }
    author?: {
      '@type': string
      name: string
    }[]
    brand?: {
      '@type': string
      name: string
    }
    contentUrl?: string
    dateModified?: string
    datePublished?: string
    description?: string
    headline?: string
    image?: string
    keywords?: string[]
    name?: string
    offers?: {
      '@type': string
      availability: string
      itemCondition: string
      price: string
      priceCurrency: string
      sku: string
      url: string
    }[]
    publisher?: {
      '@id': string
    }
    recipeIngredient?: string[]
    recipeYield?: string
    sku?: string
    thumbnailUrl?: string
    totalTime?: string
    uploadDate?: string
    url?: string
    video?: {
      '@id'?: string | null
    }
  }[]
}

// Supported languages
export type Lang = 'en' | 'es'

// Minimal product data for lists/previews
export type ListProduct = Pick<Product, 'compareAtPrice' | 'id' | 'price' | 'slug' | 'title' | 'type'>

// Traffic source medium types
export type Medium = 'organic' | 'paid' | 'social'

// Complete product data structure
export type Product = {
  compareAtPrice?: number // Optional compareAtPrice field
  createdAt: number // Unix timestamp for creation time
  demographic: Demographic
  description: Array<{ lang: Lang; value: string }>
  editedAt: number // Unix timestamp for last edit time
  id: string
  keywords: string[]
  price: number // Required price field
  slug: string
  title: string
  type: ProductType
  variants: Array<ProductVariant>
}

// Product size type derived from translation values
export type ProductSize = (typeof translations.sizes)[number]

// Product type derived from translation keys
export type ProductType = keyof typeof translations.types

// Product variant with color, size, and inventory
export type ProductVariant = {
  color: Color
  id: string // Added required id field
  isPrimary?: boolean
  key: string
  quantity: number
  size: ProductSize
}

// Customer review data structure
export type Review = {
  description: string
  firstName: string
  id: string
  lastName: string
  productSlugs: string[]
  rating: 1 | 2 | 3 | 4 | 5
  title?: string
}

import { z } from 'zod'
import type { Color, Demographic, ProductSize, ProductType } from '@/types'

export const productVariantSchema = z.object({
  id: z.string(), // Added required id field
  color: z.string() as z.ZodType<Color>,
  key: z.string(),
  quantity: z.number().int().min(0).max(100),
  size: z.string() as z.ZodType<ProductSize>,
})

export const productDescriptionSchema = z.object({
  lang: z.enum(['en', 'es']),
  value: z.string(),
})

export const productSchema = z.object({
  _id: z.string(),
  demographic: z.string() as z.ZodType<Demographic>,
  description: z.array(productDescriptionSchema),
  keywords: z.array(z.string()),
  price: z.number().int(), // Required price as integer
  compareAtPrice: z.number().int().optional(), // Optional compareAtPrice as integer
  slug: z.string(),
  title: z.string(),
  type: z.string() as z.ZodType<ProductType>,
  variants: z.array(productVariantSchema),
  createdAt: z.number().int(),
  editedAt: z.number().int(),
})

export type ProductSchema = z.infer<typeof productSchema>

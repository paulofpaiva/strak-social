import { z } from 'zod'

export const createListSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title must be at most 50 characters')
    .trim(),
  description: z
    .string()
    .max(160, 'Description must be at most 160 characters')
    .trim()
    .nullable()
    .optional(),
  coverUrl: z.string().nullable().optional(),
  isPrivate: z.boolean().default(false),
})

export const updateListSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(50, 'Title must be at most 50 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(160, 'Description must be at most 160 characters')
    .trim()
    .nullable()
    .optional(),
  coverUrl: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
})

export type CreateListFormData = z.infer<typeof createListSchema>
export type UpdateListFormData = z.infer<typeof updateListSchema>


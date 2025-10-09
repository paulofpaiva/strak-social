import { z } from 'zod'

export const commentFieldMax = {
  contentLength: 280,
  mediaFiles: 4,
} as const

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(commentFieldMax.contentLength, `Comment must be at most ${commentFieldMax.contentLength} characters`),
  parentCommentId: z.string().uuid().optional(),
})

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(commentFieldMax.contentLength, `Comment must be at most ${commentFieldMax.contentLength} characters`),
})

export type CreateCommentFormData = z.infer<typeof createCommentSchema>
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>


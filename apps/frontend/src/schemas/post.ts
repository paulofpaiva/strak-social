import { z } from 'zod'

export const createPostSchema = z.object({
  content: z.string()
    .min(1, 'Post content is required')
    .max(280, 'Post must have at most 280 characters'),
})

export type CreatePostFormData = z.infer<typeof createPostSchema>

export const createPostFieldMax = {
  content: 280,
  mediaFiles: 3,
  mediaFileSize: 20 * 1024 * 1024, // 20MB
}

export const mediaFileSchema = z.instanceof(File)
  .refine(
    (file) => file.size <= createPostFieldMax.mediaFileSize,
    (file) => ({ message: `${file.name} exceeds the maximum size of 20MB` })
  )
  .refine(
    (file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
    (file) => ({ message: `${file.name} is not a valid image or video file` })
  )

export const mediaFilesArraySchema = z.array(mediaFileSchema)
  .max(createPostFieldMax.mediaFiles, `You can add up to ${createPostFieldMax.mediaFiles} files`)

export const validateMediaFile = (file: File): { success: boolean; error?: string } => {
  try {
    mediaFileSchema.parse(file)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Invalid file' }
  }
}

export const validateMediaFiles = (files: File[]): { success: boolean; error?: string } => {
  try {
    mediaFilesArraySchema.parse(files)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Invalid files' }
  }
}


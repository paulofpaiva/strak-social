import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostSchema, createPostFieldMax, type CreatePostFormData } from '@/schemas/post'

interface UsePostFormOptions {
  defaultContent?: string
}

export function usePostForm(options: UsePostFormOptions = {}) {
  const { defaultContent = '' } = options

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: defaultContent,
    },
  })

  const content = form.watch('content')
  const contentLength = content?.length || 0

  const isContentValid = contentLength > 0 && contentLength <= createPostFieldMax.content

  return {
    ...form,
    content,
    contentLength,
    isContentValid,
    maxContentLength: createPostFieldMax.content,
  }
}

export type UsePostFormReturn = ReturnType<typeof usePostForm>


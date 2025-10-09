import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCommentSchema, commentFieldMax, type CreateCommentFormData } from '@/schemas/comment'

interface UseCommentFormOptions {
  defaultContent?: string
}

export function useCommentForm(options: UseCommentFormOptions = {}) {
  const { defaultContent = '' } = options

  const form = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: defaultContent,
    },
  })

  const content = form.watch('content')
  const contentLength = content?.length || 0

  const isContentValid = contentLength > 0 && contentLength <= commentFieldMax.contentLength

  return {
    ...form,
    content,
    contentLength,
    isContentValid,
    maxContentLength: commentFieldMax.contentLength,
  }
}

export type UseCommentFormReturn = ReturnType<typeof useCommentForm>


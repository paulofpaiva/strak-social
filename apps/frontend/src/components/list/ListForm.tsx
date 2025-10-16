import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createListSchema, type CreateListFormData } from '@/schemas/list'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { FloatingTextarea } from '@/components/ui/floating-textarea'
import { Label } from '@/components/ui/label'
import { ListCoverEditor } from './ListCoverEditor'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUploadListCover } from '@/hooks/list/useUploadListCover'

interface ListFormProps {
  defaultValues?: Partial<CreateListFormData>
  onSubmit: (data: CreateListFormData) => void
  isSubmitting?: boolean
  formId?: string
  showSubmitButton?: boolean
}

export function ListForm({ 
  defaultValues, 
  onSubmit, 
  isSubmitting = false,
  formId,
  showSubmitButton = true
}: ListFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const uploadCoverMutation = useUploadListCover()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema) as any,
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      coverUrl: defaultValues?.coverUrl || null,
      isPrivate: defaultValues?.isPrivate || false,
    },
  })

  const coverUrl = watch('coverUrl')
  const isPrivate = watch('isPrivate')
  const title = watch('title')
  const description = watch('description')

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file)
    if (!file) {
      setValue('coverUrl', null)
    }
  }

  const handleFormSubmit = async (data: CreateListFormData) => {
    if (coverFile) {
      try {
        const result = await uploadCoverMutation.mutateAsync(coverFile)
        data.coverUrl = result.coverUrl
      } catch (error) {
        console.error('Error uploading cover:', error)
        return
      }
    }
    onSubmit(data)
  }

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
      <div>
        <ListCoverEditor
          src={coverUrl}
          className="mt-2"
          onCoverChange={handleCoverChange}
        />
      </div>

      <div>
        <FloatingInput
          label="Title *"
          {...register('title')}
          maxLength={50}
          hintRight={
            <span className="text-xs text-muted-foreground">
              {title.length}/50
            </span>
          }
        />
        {errors.title?.message && (
          <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <FloatingTextarea
          label="Description (optional)"
          {...register('description')}
          rows={4}
          maxLength={160}
          className="border border-input focus:border-ring focus:ring-ring/50 focus:ring-[3px]"
        />
        <div className="flex justify-between mt-1">
          {errors.description?.message && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
          <p className="text-xs text-muted-foreground ml-auto">
            {(description || '').length}/160
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={isPrivate}
            onClick={() => setValue('isPrivate', !isPrivate)}
            className={cn(
              "h-4 w-4 shrink-0 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isPrivate && "bg-primary text-primary-foreground"
            )}
          >
            {isPrivate && <Check className="h-4 w-4" />}
          </button>
          <Label
            htmlFor="isPrivate"
            className="text-sm font-medium leading-none cursor-pointer"
            onClick={() => setValue('isPrivate', !isPrivate)}
          >
            Make private
          </Label>
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Private lists can only be seen by you
        </p>
      </div>

      {showSubmitButton && (
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || uploadCoverMutation.isPending}
        >
          Save
        </Button>
      )}
    </form>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { FloatingTextarea } from '@/components/ui/floating-textarea'
import { useToastContext } from '@/contexts/ToastContext'
import { updateProfileApi } from '@/api/profile'
import { editProfileSchema, type EditProfileFormData, editProfileFieldMax } from '@/schemas/profile'

interface EditProfileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<EditProfileFormData>
}

export function EditProfile({ open, onOpenChange, defaultValues }: EditProfileProps) {
  const { success, error } = useToastContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      bio: defaultValues?.bio ?? '',
      location: defaultValues?.location ?? '',
      website: defaultValues?.website ?? '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        bio: defaultValues?.bio ?? '',
        location: defaultValues?.location ?? '',
        website: defaultValues?.website ?? '',
      })
    }
  }, [open])

  const bio = watch('bio') ?? ''
  const location = watch('location') ?? ''
  const website = watch('website') ?? ''

  const isFormFilled = useMemo(() => {
    return (bio?.length ?? 0) > 0 || (location?.length ?? 0) > 0 || (website?.length ?? 0) > 0
  }, [bio, location, website])

  const onClose = () => {
    reset()
    onOpenChange(false)
  }

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      setIsSubmitting(true)
      await updateProfileApi({
        bio: data.bio === '' ? null : data.bio ?? null,
        location: data.location === '' ? null : data.location ?? null,
        website: data.website === '' ? null : data.website ?? null,
      })
      success('Profile updated successfully!')
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      onClose()
    } catch (e: any) {
      error(e?.message || 'Failed to update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={onClose}
      title="Edit profile"
      description="Update your bio, location and website"
      cancelText="Cancel"
      actionText="Save"
      actionButton={
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid}
          className="flex-1"
        >
          Save
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <FloatingTextarea
            id="bio"
            label="Bio"
            rows={4}
            maxLength={editProfileFieldMax.bio}
            {...register('bio')}
            className={errors.bio ? 'border-destructive' : ''}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{errors.bio?.message}</span>
            <span>{(bio?.length ?? 0)} / {editProfileFieldMax.bio}</span>
          </div>
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="location"
            label="Localização"
            type="text"
            maxLength={editProfileFieldMax.location}
            {...register('location')}
            className={errors.location ? 'border-destructive' : ''}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{errors.location?.message}</span>
            <span>{(location?.length ?? 0)} / {editProfileFieldMax.location}</span>
          </div>
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="website"
            label="Website"
            type="url"
            placeholder="https://exemplo.com"
            maxLength={editProfileFieldMax.website}
            {...register('website')}
            className={errors.website ? 'border-destructive' : ''}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{errors.website?.message}</span>
            <span>{(website?.length ?? 0)} / {editProfileFieldMax.website}</span>
          </div>
        </div>
      </form>
    </ResponsiveModal>
  )
}



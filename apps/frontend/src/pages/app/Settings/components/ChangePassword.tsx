import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { FloatingInput } from '@/components/ui/floating-input'
import { useTogglePassword } from '@/hooks/useTogglePassword'
import { changePasswordSchema, ChangePasswordFormData } from '@/schemas/auth'
import { useChangePassword } from '@/hooks/auth/useChangePassword'
import { Eye, EyeOff } from 'lucide-react'

interface ChangePasswordProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePassword({ isOpen, onClose }: ChangePasswordProps) {
  const changePasswordMutation = useChangePassword()
  
  const {
    showPassword: showCurrentPassword,
    togglePassword: toggleCurrentPassword
  } = useTogglePassword()
  
  const {
    showPassword: showNewPassword,
    togglePassword: toggleNewPassword
  } = useTogglePassword()
  
  const {
    showPassword: showConfirmPassword,
    togglePassword: toggleConfirmPassword
  } = useTogglePassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange'
  })

  const watchedFields = watch()
  const isFormValid = isValid && 
    watchedFields.currentPassword && 
    watchedFields.newPassword && 
    watchedFields.confirmPassword &&
    watchedFields.newPassword === watchedFields.confirmPassword

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync(data)
      reset()
      onClose()
    } catch (err: any) {
    }
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Change Password"
      description="Update your password to keep your account secure"
      onCancel={handleCancel}
      cancelText="Cancel"
      actionText="Save"
      actionButton={
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={changePasswordMutation.isPending || !isFormValid}
          className="flex-1"
        >
          Save
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FloatingInput
            id="current-password"
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            {...register('currentPassword')}
            className={errors.currentPassword ? 'border-destructive' : ''}
            hintRight={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-transparent"
                onClick={toggleCurrentPassword}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            }
          />
          {errors.currentPassword && (
            <p className="text-sm text-destructive mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <FloatingInput
            id="new-password"
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            {...register('newPassword')}
            className={errors.newPassword ? 'border-destructive' : ''}
            hintRight={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-transparent"
                onClick={toggleNewPassword}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            }
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <FloatingInput
            id="confirm-password"
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-destructive' : ''}
            hintRight={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-transparent"
                onClick={toggleConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            }
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </form>
    </ResponsiveModal>
  )
}

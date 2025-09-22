import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { useChangePassword } from "@/hooks"
import { useToastContext } from "@/contexts/ToastContext"
import { useIsMobile } from "@/hooks/useIsMobile"
import { changePasswordSchema, type ChangePasswordFormData } from "@/schemas/auth"
import { Eye, EyeOff } from "lucide-react"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { changePassword, isLoading } = useChangePassword()
  const { success: toastSuccess, error: toastError } = useToastContext()
  const isMobile = useIsMobile()
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data)
      toastSuccess('Password changed successfully!')
      reset()
      onClose()
    } catch (error: any) {
      toastError(error.message || 'Error changing password')
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const actionButton = (
    <Button
      type="submit"
      form="change-password-form"
      disabled={isLoading}
      className="disabled:opacity-50"
    >
      Save
    </Button>
  )

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      description="Update your password to keep your account secure."
      actionButton={actionButton}
    >
      <form id="change-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <FloatingInput
            id="currentPassword"
            type={showPasswords.current ? "text" : "password"}
            label="Current Password"
            className="pr-10"
            {...register('currentPassword')}
            hintRight={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {errors.currentPassword && (
            <p className="text-destructive text-sm">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="newPassword"
            type={showPasswords.new ? "text" : "password"}
            label="New Password"
            className="pr-10"
            {...register('newPassword')}
            hintRight={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {errors.newPassword && (
            <p className="text-destructive text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <FloatingInput
            id="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            label="Confirm New Password"
            className="pr-10"
            {...register('confirmPassword')}
            hintRight={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {!isMobile && (
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="disabled:opacity-50"
            >
              Save
            </Button>
          </div>
        )}
      </form>
    </ResponsiveModal>
  )
}

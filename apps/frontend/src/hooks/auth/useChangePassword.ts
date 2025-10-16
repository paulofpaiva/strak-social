import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { changePasswordApi } from '@/api/profile'
import type { ChangePasswordFormData } from '@/schemas/auth'

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) => changePasswordApi(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message 
        || error.message 
        || 'Failed to change password. Please try again.'
      toast.error(errorMessage)
    },
  })
}

import { api } from './auth'
import { handleApiError } from '@/utils/api-error-handler'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  user?: T
  data?: T
}

export const getProfileApi = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get<ApiResponse>('/auth/profile')
    return response.data
  } catch (error: any) {
    handleApiError(error, 'Profile fetch failed. Please try again.')
  }
}

export const updateProfileApi = async (data: { name?: string; bio?: string | null; birthDate?: string; username?: string; location?: string | null; website?: string | null }): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/profile', data)
    return response.data
  } catch (error: any) {
    handleApiError(error, 'Profile update failed. Please try again.')
  }
}

export const updateAvatarApi = async (avatar: string): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/avatar', { avatar })
    return response.data
  } catch (error: any) {
    handleApiError(error, 'Avatar update failed')
  }
}

export const updateCoverApi = async (cover: string): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/cover', { cover })
    return response.data
  } catch (error: any) {
    handleApiError(error, 'Cover update failed')
  }
}

export const changePasswordApi = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/change-password', data)
    return response.data
  } catch (error: any) {
    handleApiError(error, 'Password change failed. Please try again.')
  }
}

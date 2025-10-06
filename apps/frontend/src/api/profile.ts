import { api } from './auth'

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
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Profile fetch failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const updateProfileApi = async (data: { name?: string; bio?: string; birthDate?: string; username?: string }): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/profile', data)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Profile update failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const updateAvatarApi = async (avatar: string): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/avatar', { avatar })
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Avatar update failed')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const updateCoverApi = async (cover: string): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/cover', { cover })
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Cover update failed')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const changePasswordApi = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<ApiResponse> => {
  try {
    const response = await api.put<ApiResponse>('/auth/change-password', data)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Password change failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

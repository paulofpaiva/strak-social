import axios from 'axios'
import type { SignUpFormData, SignInFormData } from '@/schemas/auth'

const isDev = import.meta.env.DEV
const API_BASE_URL = isDev 
  ? 'http://localhost:3001/api' : 'http://localhost:8001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies
})

export interface ApiResponse<T = any> {
  success?: boolean
  message: string
  user?: T
}

export interface ApiError {
  success: boolean
  message: string
  errors?: any[]
  details?: any
}

export const signUpApi = async (data: SignUpFormData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/auth/sign-up', data)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      // Zod validation errors
      if (apiError.errors && Array.isArray(apiError.errors)) {
        const validationErrors = apiError.errors.map((err: any) => err.message).join(', ')
        throw new Error(validationErrors)
      }
      
      // Generic API error message
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Sign up failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const signInApi = async (data: SignInFormData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/auth/sign-in', data)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Login failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const signOutApi = async (): Promise<void> => {
  try {
    await api.post('/auth/sign-out')
  } catch (error: any) {
    console.error('Logout error:', error)
  }
}

export const getSessionApi = async (): Promise<ApiResponse | null> => {
  try {
    const response = await api.get<ApiResponse>('/auth/session')
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null
    }
    console.error('Session error:', error)
    return null
  }
}

export const checkUsernameApi = async (username: string): Promise<{ available: boolean; message: string }> => {
  try {
    const response = await api.get<{ available: boolean; message: string }>(`/auth/check-username?username=${encodeURIComponent(username)}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.available === false) {
        return { available: false, message: apiError.message }
      }
      
      throw new Error(apiError.message || 'Username check failed')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const updateProfileApi = async (data: { name?: string; bio?: string; birthDate?: string }): Promise<ApiResponse> => {
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


export { api }
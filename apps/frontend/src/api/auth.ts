import axios from 'axios'
import type { SignUpFormData, SignInFormData } from '@/schemas/auth'
import { handleApiError } from '@/utils/api-error-handler'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  user?: T
  data?: T
}

export interface ApiError {
  success: false
  message: string
  errors?: Array<{ field: string; message: string }>
  details?: any
}

export const signUpApi = async (data: SignUpFormData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/auth/sign-up', data)
    return response.data
  } catch (error: any) {
    handleApiError(error, 'Sign up failed. Please try again.')
  }
}

export const signInApi = async (data: SignInFormData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/auth/sign-in', data)
    return response.data
  } catch (error: any) {
    handleApiError(error, 'Login failed. Please try again.')
  }
}

export const signOutApi = async (): Promise<void> => {
  try {
    await api.post('/auth/sign-out')
  } catch (error: any) {
    console.error('Logout error:', error)
  }
}

export const getSessionApi = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get<ApiResponse>('/auth/session')
    return response.data
  } catch (error: any) {
    throw new Error('Session not found')
  }
}

export const checkUsernameApi = async (username: string): Promise<{ available: boolean; message: string }> => {
  try {
    const response = await api.get<{ success: boolean; available: boolean; message: string }>(`/auth/check-username?username=${encodeURIComponent(username)}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data?.available === false) {
      return { available: false, message: error.response.data.message }
    }
    handleApiError(error, 'Username check failed')
  }
}




export { api }
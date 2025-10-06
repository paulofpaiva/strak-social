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
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.errors && Array.isArray(apiError.errors)) {
        const validationErrors = apiError.errors.map((err: any) => err.message).join(', ')
        throw new Error(`Validation error: ${validationErrors}`)
      }
      
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




export { api }
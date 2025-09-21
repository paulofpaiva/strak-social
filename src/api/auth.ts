import axios from 'axios'
import type { SignUpFormData } from '@/schemas/auth'

const isDev = import.meta.env.DEV
const API_BASE_URL = isDev 
  ? 'http://localhost:3001/api' : 'http://localhost:8001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ApiResponse<T = any> {
  message: string
  user?: T
}

export interface ApiError {
  error: string
  details?: any
}

export const signUpApi = async (data: SignUpFormData): Promise<ApiResponse> => {
  try {
    const apiData = {
      email: data.email,
      password: data.password,
      name: data.name,
    }

    const response = await api.post<ApiResponse>('/auth/sign-up', apiData)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.details && Array.isArray(apiError.details)) {
        const validationErrors = apiError.details.map((detail: any) => detail.message).join(', ')
        throw new Error(`Validation error: ${validationErrors}`)
      }
      
      if (apiError.error) {
        throw new Error(apiError.error)
      }
      
      throw new Error('Sign up failed')
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export { api }

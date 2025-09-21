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
  message: string
  user?: T
}

export interface ApiError {
  error: string
  details?: any
}

export const signUpApi = async (data: SignUpFormData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>('/auth/sign-up', data)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.details && Array.isArray(apiError.details)) {
        const validationErrors = apiError.details.map((detail: any) => detail.message).join(', ')
        throw new Error(`Erro de validação: ${validationErrors}`)
      }
      
      if (apiError.error) {
        throw new Error(apiError.error)
      }
      
      throw new Error('Falha no cadastro. Tente novamente.')
    } else if (error.request) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    } else {
      throw new Error('Ocorreu um erro inesperado')
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
      
      if (apiError.error) {
        throw new Error(apiError.error)
      }
      
      throw new Error('Falha no login. Tente novamente.')
    } else if (error.request) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    } else {
      throw new Error('Ocorreu um erro inesperado')
    }
  }
}

export const signOutApi = async (): Promise<void> => {
  try {
    await api.post('/auth/sign-out')
  } catch (error: any) {
    // Mesmo se der erro, consideramos logout realizado
    console.error('Erro no logout:', error)
  }
}

export const getSessionApi = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get<ApiResponse>('/auth/session')
    return response.data
  } catch (error: any) {
    throw new Error('Sessão não encontrada')
  }
}

export { api }
import axios from 'axios'

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

export interface SearchUser {
  id: string
  name: string
  username: string
  avatar: string | null
  bio: string | null
  createdAt: string
}

export interface ApiResponse<T = any> {
  message: string
  users?: T[]
}

export const searchUsersApi = async (query: string, limit: number = 10): Promise<ApiResponse<SearchUser>> => {
  try {
    const response = await api.get<ApiResponse<SearchUser>>(`/search/users?q=${encodeURIComponent(query)}&limit=${limit}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to search users')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export { api }

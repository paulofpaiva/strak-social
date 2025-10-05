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

export interface SearchUsersResponse {
  success: boolean
  message: string
  data: {
    users: SearchUser[]
  }
}

export const searchUsersApi = async (query: string, limit: number = 10): Promise<SearchUsersResponse> => {
  try {
    const response = await api.get<SearchUsersResponse>(`/search/users?q=${encodeURIComponent(query)}&limit=${limit}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    }
    throw new Error('An unexpected error occurred')
  }
}

export { api }

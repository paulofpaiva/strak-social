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

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  cover?: string
  bio?: string
  createdAt: string
  followersCount: number
  followingCount: number
}

export interface GetUserResponse {
  success: boolean
  message: string
  data: User
}

export const getUserByUsernameApi = async (username: string): Promise<GetUserResponse> => {
  try {
    const response = await api.get<GetUserResponse>(`/users/username/${encodeURIComponent(username)}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    if (error.response?.status === 404) {
      throw new Error('User not found')
    }
    if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    }
    throw new Error('An unexpected error occurred')
  }
}

export { api }

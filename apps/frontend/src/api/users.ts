import { api } from './auth'

export interface User {
  id: string
  name: string
  username: string
  email?: string
  avatar: string | null
  cover: string | null
  bio: string | null
  createdAt: string
  followersCount: number
  followingCount: number
  isFollowing?: boolean
}

export interface UserResponse {
  success: boolean
  message: string
  data: User
}

export interface UserError {
  success: false
  message: string
  details?: any
}

export const getUserByIdApi = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<UserResponse>(`/users/${userId}`)
    return response.data.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Failed to fetch user. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const getUserByUsernameApi = async (username: string): Promise<User> => {
  try {
    const response = await api.get<UserResponse>(`/users/username/${username}`)
    return response.data.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      
      if (apiError.message) {
        throw new Error(apiError.message)
      }
      
      throw new Error('Failed to fetch user. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}


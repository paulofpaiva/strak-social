import { api } from './auth'
import { handleApiError } from '@/utils/api-error-handler'

export interface User {
  id: string
  name: string
  username: string
  email?: string
  avatar: string | null
  cover: string | null
  bio: string | null
  location?: string | null
  website?: string | null
  isVerified?: boolean
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
    handleApiError(error, 'Failed to fetch user. Please try again.')
  }
}

export const getUserByUsernameApi = async (username: string): Promise<User> => {
  try {
    const response = await api.get<UserResponse>(`/users/username/${username}`)
    return response.data.data
  } catch (error: any) {
    handleApiError(error, 'Failed to fetch user. Please try again.')
  }
}

export interface SearchUsersResponse {
  success: boolean
  message: string
  data: { 
    users: Array<Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'bio' | 'isVerified' | 'createdAt' | 'isFollowing'>>
    pagination: {
      page: number
      limit: number
      hasMore: boolean
    }
  }
}

export const searchUsersApi = async (
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<{ items: Array<Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'bio' | 'isVerified' | 'createdAt' | 'isFollowing'>>; page: number; limit: number; hasMore?: boolean }> => {
  try {
    const response = await api.get<SearchUsersResponse>(`/search/users`, {
      params: { q: query, page, limit }
    })
    const d = response.data.data
    if (d?.users && d?.pagination) {
      return { 
        items: d.users, 
        page: d.pagination.page, 
        limit: d.pagination.limit, 
        hasMore: d.pagination.hasMore 
      }
    }
    return { items: d?.users || [], page: 1, limit, hasMore: false }
  } catch (error: any) {
    handleApiError(error, 'Failed to search users. Please try again.')
  }
}

export interface SuggestedUser {
  id: string
  name: string
  username: string
  avatar: string | null
  bio: string | null
  isVerified: boolean
  isFollowing: boolean
}

export interface UserSuggestionsResponse {
  success: boolean
  message: string
  data: {
    users: SuggestedUser[]
  }
}

export const getUserSuggestionsApi = async (limit: number = 8): Promise<SuggestedUser[]> => {
  try {
    const response = await api.get<UserSuggestionsResponse>(`/users/suggestions`, {
      params: { limit }
    })
    return response.data.data.users
  } catch (error: any) {
    handleApiError(error, 'Failed to fetch user suggestions. Please try again.')
  }
}


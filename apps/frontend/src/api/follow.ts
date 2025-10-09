import { api } from './auth'
import type { User } from './users'
import { handleApiError } from '@/utils/api-error-handler'

export interface ListResponse<T> {
  success: boolean
  message: string
  data: any
}

export const getUserFollowingApi = async (
  userId: string,
  page = 1,
  limit = 20,
  search?: string,
): Promise<{ items: User[]; page: number; limit: number; hasMore?: boolean; total?: number }> => {
  try {
    const response = await api.get<ListResponse<User>>(`/follow/${userId}/following`, {
      params: { page, limit, search },
    })
    const d = response.data.data
    if (d?.following && d?.pagination) {
      return { items: d.following, page: d.pagination.page, limit: d.pagination.limit, hasMore: d.pagination.hasMore }
    }
    return d
  } catch (error: any) {
    handleApiError(error, 'Failed to load following list. Please try again.')
  }
}

export const getUserFollowersApi = async (
  userId: string,
  page = 1,
  limit = 20,
  search?: string,
): Promise<{ items: User[]; page: number; limit: number; hasMore?: boolean; total?: number }> => {
  try {
    const response = await api.get<ListResponse<User>>(`/follow/${userId}/followers`, {
      params: { page, limit, search },
    })
    const d = response.data.data
    if (d?.followers && d?.pagination) {
      return { items: d.followers, page: d.pagination.page, limit: d.pagination.limit, hasMore: d.pagination.hasMore }
    }
    return d
  } catch (error: any) {
    handleApiError(error, 'Failed to load followers list. Please try again.')
  }
}

export interface ToggleFollowResponse {
  success: boolean
  message: string
  data: {
    isFollowing: boolean
    followersCount: number
    followingCount: number
  }
}

export const toggleFollowApi = async (userId: string): Promise<{ isFollowing: boolean; followersCount: number; followingCount: number }> => {
  try {
    const response = await api.post<ToggleFollowResponse>(`/follow/toggle`, {
      userId
    })
    return response.data.data
  } catch (error: any) {
    handleApiError(error, 'Failed to toggle follow status. Please try again.')
  }
}

export interface RemoveFollowerResponse {
  success: boolean
  message: string
  data: {
    isFollowing: boolean
    followersCount: number
    followingCount: number
  }
}

export const removeFollowerApi = async (userId: string): Promise<{ isFollowing: boolean; followersCount: number; followingCount: number }> => {
  try {
    const response = await api.delete<RemoveFollowerResponse>(`/follow/remove`, {
      data: { userId }
    })
    return response.data.data
  } catch (error: any) {
    handleApiError(error, 'Failed to remove follower. Please try again.')
  }
}



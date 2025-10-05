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

export interface FollowToggleResponse {
  success: boolean
  message: string
  data: {
    isFollowing: boolean
  }
}

export interface FollowStatusResponse {
  success: boolean
  message: string
  data: {
    isFollowing: boolean
  }
}

export interface FollowersResponse {
  success: boolean
  message: string
  data: {
    followers: any[]
    pagination: {
      page: number
      limit: number
      hasMore: boolean
    }
  }
}

export interface FollowingResponse {
  success: boolean
  message: string
  data: {
    following: any[]
    pagination: {
      page: number
      limit: number
      hasMore: boolean
    }
  }
}

export const toggleFollowApi = async (userId: string): Promise<FollowToggleResponse> => {
  try {
    const response = await api.post<FollowToggleResponse>('/follow/toggle', { userId })
    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Failed to toggle follow')
  }
}

export const getFollowStatusApi = async (userId: string): Promise<FollowStatusResponse> => {
  try {
    const response = await api.get<FollowStatusResponse>(`/follow/check/${userId}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Failed to get follow status')
  }
}

export const getFollowersApi = async (userId: string, page = 1, limit = 10): Promise<FollowersResponse> => {
  try {
    const response = await api.get<FollowersResponse>(`/follow/${userId}/followers?page=${page}&limit=${limit}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Failed to get followers')
  }
}

export const getFollowingApi = async (userId: string, page = 1, limit = 10): Promise<FollowingResponse> => {
  try {
    const response = await api.get<FollowingResponse>(`/follow/${userId}/following?page=${page}&limit=${limit}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Failed to get following')
  }
}

export const followUserApi = toggleFollowApi
export const unfollowUserApi = toggleFollowApi

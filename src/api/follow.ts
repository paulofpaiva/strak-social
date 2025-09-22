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

export interface FollowUserResponse {
  message: string
}

export interface FollowStatusResponse {
  isFollowing: boolean
}

export const followUserApi = async (userId: string): Promise<FollowUserResponse> => {
  try {
    const response = await api.post<FollowUserResponse>('/follow/follow', { userId })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to follow user')
  }
}

export const unfollowUserApi = async (userId: string): Promise<FollowUserResponse> => {
  try {
    const response = await api.post<FollowUserResponse>('/follow/unfollow', { userId })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to unfollow user')
  }
}

export const getFollowStatusApi = async (userId: string): Promise<FollowStatusResponse> => {
  try {
    const response = await api.get<FollowStatusResponse>(`/follow/status/${userId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get follow status')
  }
}

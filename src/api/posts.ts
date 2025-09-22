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

export interface Post {
  id: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    username: string
    avatar: string | null
  }
}

export interface CreatePostData {
  content: string
}

export interface ApiResponse<T = any> {
  message: string
  post?: T
  posts?: T[]
  pagination?: {
    page: number
    limit: number
    hasMore: boolean
  }
}

export const createPostApi = async (data: CreatePostData): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.post<ApiResponse<Post>>('/posts', data)
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
      
      throw new Error('Post creation failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const getPostsApi = async (page: number = 1, limit: number = 10): Promise<ApiResponse<Post[]>> => {
  try {
    const response = await api.get<ApiResponse<Post[]>>(`/posts?page=${page}&limit=${limit}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to fetch posts')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const getUserPostsApi = async (userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Post[]>> => {
  try {
    const response = await api.get<ApiResponse<Post[]>>(`/posts/user/${userId}?page=${page}&limit=${limit}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to fetch user posts')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export { api }

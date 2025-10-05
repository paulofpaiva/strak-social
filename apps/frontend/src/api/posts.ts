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
  media?: PostMedia[]
  likesCount: number
  userLiked: boolean
  commentsCount?: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  parentCommentId?: string | null
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    username: string
    avatar: string | null
  }
  media?: CommentMedia[]
  likesCount?: number
  userLiked?: boolean
  repliesCount?: number
}

export interface CommentMedia {
  id: string
  mediaUrl: string
  mediaType: 'image' | 'gif' | 'video'
  order: number
}

export interface CreateCommentMedia {
  mediaUrl: string
  mediaType: 'image' | 'gif' | 'video'
  order: number
}

export interface CreateCommentData {
  content: string
  parentCommentId?: string
  media?: CreateCommentMedia[]
}

export interface PostMedia {
  id: string
  mediaUrl: string
  mediaType: 'image' | 'gif' | 'video'
  order: number
}

export interface CreatePostMedia {
  mediaUrl: string
  mediaType: 'image' | 'gif' | 'video'
  order: number
}

export interface CreatePostData {
  content: string
  media?: CreatePostMedia[]
}

export interface ApiResponse<T = any> {
  message: string
  post?: T
  posts?: T[]
  comments?: T[]
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

export const deletePostApi = async (postId: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete<ApiResponse>(`/posts/${postId}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to delete post')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const updatePostApi = async (postId: string, data: CreatePostData): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.put<ApiResponse<Post>>(`/posts/${postId}`, data)
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
      
      throw new Error('Post update failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const getPostApi = async (postId: string): Promise<ApiResponse<Post>> => {
  try {
    const response = await api.get<ApiResponse<Post>>(`/posts/${postId}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to fetch post')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const getPostCommentsApi = async (postId: string, page: number = 1, limit: number = 3): Promise<ApiResponse<Comment[]>> => {
  try {
    const response = await api.get<ApiResponse<Comment[]>>(`/comments/post/${postId}?page=${page}&limit=${limit}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to fetch comments')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const createCommentApi = async (postId: string, data: CreateCommentData): Promise<ApiResponse<Comment>> => {
  try {
    const response = await api.post<ApiResponse<Comment>>(`/comments/${postId}`, data)
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
      
      throw new Error('Comment creation failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const updateCommentApi = async (commentId: string, data: CreateCommentData): Promise<ApiResponse<Comment>> => {
  try {
    const response = await api.put<ApiResponse<Comment>>(`/comments/${commentId}`, data)
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
      
      throw new Error('Comment update failed. Please try again.')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const deleteCommentApi = async (commentId: string): Promise<ApiResponse> => {
  try {
    const response = await api.delete<ApiResponse>(`/comments/${commentId}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to delete comment')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const likePostApi = async (postId: string): Promise<ApiResponse & { liked: boolean }> => {
  try {
    const response = await api.post<ApiResponse & { liked: boolean }>(`/posts/${postId}/like`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to like post')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const likeCommentApi = async (commentId: string): Promise<ApiResponse & { liked: boolean }> => {
  try {
    const response = await api.post<ApiResponse & { liked: boolean }>(`/comments/${commentId}/like`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to like comment')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const getCommentApi = async (commentId: string): Promise<ApiResponse & { comment: Comment }> => {
  try {
    const response = await api.get<ApiResponse & { comment: Comment }>(`/comments/comment/${commentId}`)
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to get comment')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export const getCommentRepliesApi = async (commentId: string, page: number = 1, limit: number = 10): Promise<ApiResponse & { replies: Comment[], pagination: any }> => {
  try {
    const response = await api.get<ApiResponse & { replies: Comment[], pagination: any }>(`/comments/comment/${commentId}/replies`, {
      params: { page, limit }
    })
    return response.data
  } catch (error: any) {
    if (error.response?.data) {
      const apiError = error.response.data
      throw new Error(apiError.error || 'Failed to get comment replies')
    } else if (error.request) {
      throw new Error('Connection error. Please check your internet and try again.')
    } else {
      throw new Error('An unexpected error occurred')
    }
  }
}

export { api }

import { api } from './auth'

export interface PostMedia {
  id: string
  postId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  order: number
}

export interface PostUser {
  id: string
  name: string
  username: string
  avatar?: string | null
}

export interface Post {
  id: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  user: PostUser
  media: PostMedia[]
  likesCount: number
  commentsCount: number
  userLiked: boolean
}

export interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    hasMore: boolean
  }
}

export const createPostApi = async (content: string, files: File[]) => {
  const formData = new FormData()
  formData.append('content', content)
  
  files.forEach(file => {
    formData.append('media', file)
  })
  
  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  
  return response.data
}

export const getUserPostsApi = async (userId: string, page: number = 1, limit: number = 10): Promise<PostsResponse> => {
  const response = await api.get(`/posts/user/${userId}`, {
    params: { page, limit }
  })
  
  return response.data.data
}


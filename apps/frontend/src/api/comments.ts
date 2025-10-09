import { api } from './auth'

export interface CommentMedia {
  id: string
  commentId: string
  mediaUrl: string
  mediaType: 'image' | 'video' | 'gif'
  order: number
}

export interface CommentUser {
  id: string
  name: string
  username: string
  avatar?: string | null
  isVerified?: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  parentCommentId?: string | null
  content: string
  createdAt: string
  user: CommentUser
  media: CommentMedia[]
  likesCount: number
  userLiked: boolean
  repliesCount?: number
}

export interface CommentsResponse {
  comments: Comment[]
  pagination: {
    page: number
    limit: number
    hasMore: boolean
  }
}

export interface RepliesResponse {
  replies: Comment[]
  pagination: {
    page: number
    limit: number
    hasMore: boolean
  }
}

export interface CreateCommentData {
  content: string
  parentCommentId?: string
}

export interface UpdateCommentData {
  content: string
}

export const getPostComments = async (
  postId: string,
  page: number = 1,
  limit: number = 10
): Promise<CommentsResponse> => {
  const response = await api.get(`/comments/post/${postId}`, {
    params: { page, limit }
  })
  return response.data.data
}

export const getCommentReplies = async (
  commentId: string,
  page: number = 1,
  limit: number = 5
): Promise<RepliesResponse> => {
  const response = await api.get(`/comments/comment/${commentId}/replies`, {
    params: { page, limit }
  })
  return response.data.data
}

export const createComment = async (
  postId: string,
  data: CreateCommentData,
  files: File[]
) => {
  const formData = new FormData()
  formData.append('content', data.content)
  
  if (data.parentCommentId) {
    formData.append('parentCommentId', data.parentCommentId)
  }
  
  files.forEach(file => {
    formData.append('media', file)
  })
  
  const response = await api.post(`/comments/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  
  return response.data
}

export const updateComment = async (
  commentId: string,
  data: UpdateCommentData,
  files: File[],
  mediaOrder: Array<{ id: string; isExisting: boolean }>
) => {
  const formData = new FormData()
  formData.append('content', data.content)
  formData.append('mediaOrder', JSON.stringify(mediaOrder))
  
  files.forEach(file => {
    formData.append('media', file)
  })
  
  const response = await api.put(`/comments/${commentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  
  return response.data
}

export const deleteComment = async (commentId: string) => {
  const response = await api.delete(`/comments/${commentId}`)
  return response.data
}

export const toggleLikeComment = async (commentId: string) => {
  const response = await api.post(`/comments/${commentId}/like`)
  return response.data
}

export const getPostById = async (postId: string) => {
  const response = await api.get(`/posts/${postId}`)
  return response.data.data
}


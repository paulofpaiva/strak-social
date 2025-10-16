import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export interface List {
  id: string
  userId: string
  title: string
  description: string | null
  coverUrl: string | null
  isPrivate: boolean
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    name: string
    username: string
    avatar: string | null
    isVerified: boolean
  }
  membersCount: number
  isOwner: boolean
  isMember?: boolean
}

export interface ListMember {
  id: string
  name: string
  username: string
  avatar: string | null
  isVerified: boolean
  joinedAt?: string
}

export interface CreateListData {
  title: string
  description?: string | null
  coverUrl?: string | null
  isPrivate?: boolean
}

export interface UpdateListData {
  title?: string
  description?: string | null
  coverUrl?: string | null
  isPrivate?: boolean
}

export const getListsApi = async (page: number = 1, limit: number = 20) => {
  const response = await api.get('/lists', {
    params: { page, limit }
  })
  return response.data.data
}

export const createListApi = async (data: CreateListData) => {
  const response = await api.post('/lists', data)
  return response.data.data
}

export const getListByIdApi = async (id: string) => {
  const response = await api.get(`/lists/${id}`)
  return response.data.data
}

export const updateListApi = async (id: string, data: UpdateListData) => {
  const response = await api.patch(`/lists/${id}`, data)
  return response.data.data
}

export const deleteListApi = async (id: string) => {
  const response = await api.delete(`/lists/${id}`)
  return response.data
}

export const getListMembersApi = async (listId: string, page: number = 1, limit: number = 20, search?: string) => {
  const params: any = { page, limit }
  if (search && search.trim().length > 0) {
    params.search = search.trim()
  }
  
  const response = await api.get(`/lists/${listId}/members`, {
    params
  })
  return response.data.data
}


export const removeListMemberApi = async (listId: string, userId: string) => {
  const response = await api.delete(`/lists/${listId}/members/${userId}`)
  return response.data
}

export const searchListsApi = async (query: string, page: number = 1, limit: number = 20) => {
  const response = await api.get('/lists/search', {
    params: { q: query, page, limit }
  })
  return response.data.data
}

export const followListApi = async (listId: string) => {
  const response = await api.post(`/lists/${listId}/follow`)
  return response.data
}

export const unfollowListApi = async (listId: string) => {
  const response = await api.delete(`/lists/${listId}/unfollow`)
  return response.data
}

export const uploadListCoverApi = async (file: File) => {
  const formData = new FormData()
  formData.append('cover', file)

  const response = await api.post('/upload/list-cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data
}

export const deleteListCoverApi = async (coverUrl: string) => {
  const response = await api.delete('/upload/list-cover', {
    data: { coverUrl }
  })
  return response.data
}

export const getPostListsApi = async (postId: string) => {
  const response = await api.get(`/lists/posts/${postId}`)
  return response.data.data
}

export const setPostListsApi = async (postId: string, listIds: string[]) => {
  const response = await api.put(`/lists/posts/${postId}`, { listIds })
  return response.data.data
}

export const getListPostsApi = async (listId: string, page: number = 1, limit: number = 10) => {
  const response = await api.get(`/lists/${listId}/posts`, {
    params: { page, limit }
  })
  return response.data.data
}

export const removePostFromListApi = async (listId: string, postId: string) => {
  const response = await api.delete(`/lists/${listId}/posts/${postId}`)
  return response.data
}


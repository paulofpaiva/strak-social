import { api } from './auth'

export interface NewsSource {
  id: string | null
  name: string
}

export interface NewsArticle {
  source: NewsSource
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

export interface GetNewsParams {
  page?: number
  pageSize?: number
  country?: string
  category?: string
}

export async function getTopHeadlines({
  page = 1,
  pageSize = 10,
  country = 'us',
  category = 'technology'
}: GetNewsParams = {}): Promise<NewsResponse> {
  try {
    const response = await api.get('/news/top-headlines', {
      params: {
        country,
        category,
        page,
        pageSize
      }
    })
    
    return response.data.data
  } catch (error) {
    console.error('Error fetching news:', error)
    throw error
  }
}

export async function searchNews({
  query,
  page = 1,
  pageSize = 10
}: GetNewsParams & { query: string }): Promise<NewsResponse> {
  try {
    const response = await api.get('/news/search', {
      params: {
        q: query,
        page,
        pageSize
      }
    })
    
    return response.data.data
  } catch (error) {
    console.error('Error searching news:', error)
    throw error
  }
}


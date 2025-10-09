import axios from 'axios'

const NEWS_API_KEY = import.meta.env.VITE_NEWSAPI_API_KEY
const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

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
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        country,
        category,
        page,
        pageSize
      }
    })
    
    return response.data
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
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        apiKey: NEWS_API_KEY,
        q: query,
        page,
        pageSize,
        sortBy: 'publishedAt'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error searching news:', error)
    throw error
  }
}


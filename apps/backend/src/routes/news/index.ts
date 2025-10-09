import { Router, Request, Response } from 'express'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/top-headlines', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', pageSize = '10', country = 'us', category = 'technology' } = req.query

  const apiKey = process.env.NEWS_API_KEY

  if (!apiKey) {
    throw new AppError('News API key not configured', 500)
  }

  const params = new URLSearchParams({
    apiKey,
    page: page as string,
    pageSize: pageSize as string,
    country: country as string,
    category: category as string,
  })

  const response = await fetch(`https://newsapi.org/v2/top-headlines?${params}`)
  
  if (!response.ok) {
    throw new AppError('Failed to fetch news', response.status)
  }

  const data = await response.json()

  return ApiResponse.success(res, data, 'News fetched successfully')
}))

export default router


import { Router, Request, Response } from 'express'
import { ApiResponse } from '../../utils/response'

const router = Router()

router.post('/', (req: Request, res: Response) => {
  res.clearCookie('auth_token')
  return ApiResponse.success(res, null, 'Logout successful')
})

export default router


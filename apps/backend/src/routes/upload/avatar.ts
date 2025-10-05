import { Router, Request, Response } from 'express'
import { avatarUpload } from './config'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.post('/avatar', avatarUpload.single('avatar'), (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400)
  }

  const fileUrl = `/uploads/avatars/${req.file.filename}`
  
  return ApiResponse.success(res, {
    url: fileUrl,
    filename: req.file.filename
  }, 'Avatar uploaded successfully')
})

export default router


import { Router, Request, Response } from 'express'
import { coverUpload } from './config'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.post('/cover', coverUpload.single('cover'), (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400)
  }

  const fileUrl = `/uploads/covers/${req.file.filename}`
  
  return ApiResponse.success(res, {
    url: fileUrl,
    filename: req.file.filename
  }, 'Cover uploaded successfully')
})

export default router


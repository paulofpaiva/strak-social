import { Router, Request, Response } from 'express'
import { mediaUpload } from './config'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.post('/media', mediaUpload.single('media'), (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400)
  }

  const fileUrl = `/uploads/media/${req.file.filename}`
  
  return ApiResponse.success(res, {
    url: fileUrl,
    filename: req.file.filename,
    type: req.file.mimetype.startsWith('video/') ? 'video' : 'image'
  }, 'Media uploaded successfully')
})

export default router


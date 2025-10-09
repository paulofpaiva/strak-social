import { Router, Request, Response } from 'express'
import { mediaUpload } from './config'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { asyncHandler } from '../../middleware/asyncHandler'
import { uploadFile, generateMediaFilename } from '../../services/storage'
import { mediaUploadLimiter } from '../../middleware/rateLimiter'
import path from 'path'

const router = Router()

router.post('/media', mediaUploadLimiter, mediaUpload.single('media'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400)
  }

  const extension = path.extname(req.file.originalname)
  const filename = generateMediaFilename(extension)

  // Upload to Firebase Storage
  const fileUrl = await uploadFile(
    req.file.buffer,
    'medias',
    filename,
    req.file.mimetype
  )
  
  return ApiResponse.success(res, {
    url: fileUrl,
    filename,
    type: req.file.mimetype.startsWith('video/') ? 'video' : 'image'
  }, 'Media uploaded successfully')
}))

export default router


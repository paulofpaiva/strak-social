import { Router, Request, Response } from 'express'
import { coverUpload } from './config'
import { ApiResponse } from '../../utils/response'
import { AppError } from '../../middleware/errorHandler'
import { authenticateToken } from '../../middleware/auth'
import { asyncHandler } from '../../middleware/asyncHandler'
import { uploadFile, generateCoverFilename, deleteFile } from '../../services/storage'
import { coverUploadLimiter } from '../../middleware/rateLimiter'
import path from 'path'

const router = Router()

router.post('/list-cover', authenticateToken, coverUploadLimiter, coverUpload.single('cover'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400)
  }

  const userId = req.user!.id
  const extension = path.extname(req.file.originalname)
  const filename = generateCoverFilename(userId, extension)

  try {
    const coverUrl = await uploadFile(
      req.file.buffer,
      'lists',
      filename,
      req.file.mimetype
    )

    return ApiResponse.success(res, { coverUrl }, 'List cover uploaded successfully')
  } catch (error) {
    throw error
  }
}))

router.delete('/list-cover', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { coverUrl } = req.body

  if (!coverUrl) {
    throw new AppError('No cover URL provided', 400)
  }

  await deleteFile(coverUrl)

  return ApiResponse.success(res, null, 'List cover deleted successfully')
}))

export default router


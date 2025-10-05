import { Router, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import { AppError } from '../../middleware/errorHandler'

const router = Router()

router.get('/uploads/avatars/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename
  const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename)
  
  if (!fs.existsSync(filePath)) {
    throw new AppError('File not found', 404)
  }
  
  res.sendFile(filePath)
})

router.get('/uploads/covers/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename
  const filePath = path.join(process.cwd(), 'uploads', 'covers', filename)
  
  if (!fs.existsSync(filePath)) {
    throw new AppError('File not found', 404)
  }
  
  res.sendFile(filePath)
})

router.get('/uploads/media/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename
  const filePath = path.join(process.cwd(), 'uploads', 'media', filename)
  
  if (!fs.existsSync(filePath)) {
    throw new AppError('File not found', 404)
  }
  
  res.sendFile(filePath)
})

export default router


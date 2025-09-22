import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars')
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'covers')
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

const coverUpload = multer({
  storage: coverStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

router.post('/avatar', avatarUpload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`
    
    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

router.post('/cover', coverUpload.single('cover'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileUrl = `/uploads/covers/${req.file.filename}`
    
    res.json({
      message: 'Cover uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('Cover upload error:', error)
    res.status(500).json({ error: 'Cover upload failed' })
  }
})

router.get('/uploads/avatars/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    res.sendFile(filePath)
  } catch (error) {
    console.error('File serve error:', error)
    res.status(500).json({ error: 'Failed to serve file' })
  }
})

router.get('/uploads/covers/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(process.cwd(), 'uploads', 'covers', filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    res.sendFile(filePath)
  } catch (error) {
    console.error('Cover file serve error:', error)
    res.status(500).json({ error: 'Failed to serve cover file' })
  }
})

export default router

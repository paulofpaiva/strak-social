import { uploadFile, deleteFile, generateMediaFilename } from './storage'
import path from 'path'

interface MediaUploadResult {
  url: string
  type: 'image' | 'video'
  order: number
}

export const uploadPostMediaFiles = async (
  files: Express.Multer.File[]
): Promise<MediaUploadResult[]> => {
  const uploadedMedia: MediaUploadResult[] = []
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const extension = path.extname(file.originalname)
      const filename = generateMediaFilename(extension)
      
      const url = await uploadFile(
        file.buffer,
        'medias',
        filename,
        file.mimetype
      )
      
      uploadedMedia.push({
        url,
        type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        order: i
      })
    }
    
    return uploadedMedia
  } catch (error) {
    for (const media of uploadedMedia) {
      await deleteFile(media.url)
    }
    throw error
  }
}

export const deletePostMediaFiles = async (mediaUrls: string[]): Promise<void> => {
  for (const url of mediaUrls) {
    await deleteFile(url)
  }
}

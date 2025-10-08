import { getFirebaseApp } from './firebase'
import { randomUUID } from 'crypto'

/**
 * Upload file to Firebase Storage
 * @param fileBuffer File buffer from multer
 * @param folder Destination folder (avatars, covers, medias)
 * @param filename File name
 * @param mimetype MIME type of the file
 * @returns Public URL of the uploaded file
 */
export const uploadFile = async (
  fileBuffer: Buffer,
  folder: 'avatars' | 'covers' | 'medias',
  filename: string,
  mimetype: string
): Promise<string> => {
  try {
    const app = getFirebaseApp()
    const bucket = app.storage().bucket()
    
    const filePath = `${folder}/${filename}`
    const file = bucket.file(filePath)

    await file.save(fileBuffer, {
      metadata: {
        contentType: mimetype,
      },
      public: true,
    })

    await file.makePublic()

    // Return public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`
    
    return publicUrl
  } catch (error) {
    console.error('Error uploading file to Firebase:', error)
    throw new Error('Failed to upload file to Firebase Storage')
  }
}

/**
 * Delete file from Firebase Storage
 * @param fileUrl Complete file URL or relative path
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  if (!fileUrl) return

  try {
    const app = getFirebaseApp()
    const bucket = app.storage().bucket()

    let filePath = fileUrl
    
    // Extract file path from URL if it's a complete URL
    if (fileUrl.includes('storage.googleapis.com')) {
      const urlParts = fileUrl.split(`${bucket.name}/`)
      if (urlParts.length > 1) {
        filePath = urlParts[1]
      }
    }

    // Remove query strings if present
    filePath = filePath.split('?')[0]

    const file = bucket.file(filePath)
    
    // Check if file exists before deleting
    const [exists] = await file.exists()
    
    if (exists) {
      await file.delete()
      console.log(`File deleted from Firebase: ${filePath}`)
    } else {
      console.log(`File not found in Firebase: ${filePath}`)
    }
  } catch (error) {
    console.error('Error deleting file from Firebase:', error)
    // Don't throw error to avoid breaking the flow if file doesn't exist
  }
}

/**
 * Generate unique filename for avatar
 * @param userId User ID (UUID)
 * @param extension File extension
 * @returns Filename in format: {userId}_{timestamp}.{ext}
 */
export const generateAvatarFilename = (userId: string, extension: string): string => {
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '')
    .split('.')[0]
  return `${userId}_${timestamp}${extension}`
}

/**
 * Generate unique filename for cover
 * @param userId User ID (UUID)
 * @param extension File extension
 * @returns Filename in format: {userId}_{timestamp}.{ext}
 */
export const generateCoverFilename = (userId: string, extension: string): string => {
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '')
    .split('.')[0]
  return `${userId}_${timestamp}${extension}`
}

/**
 * Generate unique filename for media
 * @param extension File extension
 * @returns Filename in format: {uuid}_{timestamp}.{ext}
 */
export const generateMediaFilename = (extension: string): string => {
  const uuid = randomUUID()
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '')
    .split('.')[0]
  return `${uuid}_${timestamp}${extension}`
}


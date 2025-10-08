export interface MediaFile {
  id: string
  file: File | null
  preview: string
  isExisting?: boolean
  mediaType?: 'image' | 'video'
}

export interface MediaOrder {
  id: string
  isExisting: boolean
}


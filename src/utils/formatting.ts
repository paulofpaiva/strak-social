export const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
  } catch {
    return ''
  }
}

export const getFullCoverUrl = (coverPath: string): string => {
  if (coverPath.startsWith('http')) {
    return coverPath
  }
  const filename = coverPath.replace('/uploads/covers/', '')
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  return `${API_BASE_URL}/uploads/covers/${filename}`
}

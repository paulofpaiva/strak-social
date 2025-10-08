export const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
  } catch {
    return ''
  }
}

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date()
  const postDate = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'now'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays}d`
  
  return postDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

import { Button } from '@/components/ui/button'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { useAuth } from '@/hooks'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'

interface Post {
  id: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    username: string
    avatar: string | null
  }
  media?: Array<{
    id: string
    mediaUrl: string
    mediaType: string
    order: number
  }>
  likesCount: number
  userLiked: boolean
  commentsCount?: number
}

interface PostActionsProps {
  post: Post
  onEditPost: () => void
  onDeletePost: () => void
}

export function PostActions({ post, onEditPost, onDeletePost }: PostActionsProps) {
  const { user } = useAuth()

  const isMyPost = user?.id === post.userId

  if (!isMyPost) return null

  return (
    <>
      <ResponsiveDropdown
        trigger={
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
        items={[
          {
            label: 'Edit',
            icon: <Edit className="h-4 w-4" />,
            onClick: onEditPost
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: onDeletePost,
            variant: 'destructive'
          }
        ]}
      />
    </>
  )
}

import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { PostMedia } from './PostMedia'
import { formatPostDate } from '@/utils/date'
import type { Post } from '@/api/posts'
import { Heart, MessageCircle } from 'lucide-react'

interface PostCardProps {
  post: Post
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article
      className={cn(
        'bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors',
        className
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          src={post.user.avatar || undefined}
          name={post.user.name}
          size="md"
          className="flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground truncate">
                {post.user.name}
              </span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                {formatPostDate(post.createdAt)}
              </span>
            </div>
            <span className="text-muted-foreground text-sm truncate">
              @{post.user.username}
            </span>
          </div>
        </div>
      </div>

      {post.content && (
        <div className="mb-3">
          <p className="text-foreground whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>
      )}

      {post.media && post.media.length > 0 && (
        <div className="mb-3">
          <PostMedia media={post.media} />
        </div>
      )}

      <div className="flex items-center gap-6 text-muted-foreground text-sm">
        <div className="flex items-center gap-1.5">
          <Heart 
            className={cn(
              'h-5 w-5',
              post.userLiked && 'fill-red-500 text-red-500'
            )} 
          />
          <span>{post.likesCount}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-5 w-5" />
          <span>{post.commentsCount}</span>
        </div>
      </div>
    </article>
  )
}

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post/PostCard'
import { CommentsList } from '@/components/comment/CommentsList'
import { CreateComment } from '@/components/comment/CreateComment'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { getPostById } from '@/api/comments'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useSearchNavigation } from '@/hooks'

export function Post() {
  const { id } = useParams<{ id: string }>()
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  
  const { getReturnUrl } = useSearchNavigation({
    basePath: '/post',
    defaultReturnPath: '/feed'
  })

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <PostCardSkeleton />
        <div className="border-t border-border mt-4" />
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorEmpty
          title="Post not found"
          description="The post you're looking for doesn't exist or has been deleted."
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
       <Breadcrumb to={getReturnUrl()} label="Back" />
      <div>
        <PostCard post={post} readOnly={false} disableNavigation={true} showFullDate={true} />
      </div>

      <div className="p-4">
        <Button
          onClick={() => setIsCommentModalOpen(true)}
          variant="outline"
          className="w-full"
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Add a comment
        </Button>
      </div>

      <div>
        <CommentsList postId={post.id} />
      </div>

      <CreateComment
        open={isCommentModalOpen}
        onOpenChange={setIsCommentModalOpen}
        postId={post.id}
      />
    </div>
  )
}


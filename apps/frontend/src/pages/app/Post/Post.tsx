import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PostCard } from '@/components/post/PostCard'
import { CommentsList } from '@/components/comment/CommentsList'
import { InlineCommentForm } from '@/components/comment/InlineCommentForm'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { getPostById } from '@/api/comments'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useSearchNavigation } from '@/hooks'

export function Post() {
  const { id } = useParams<{ id: string }>()
  
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
      <>
        <PostCardSkeleton />
        <div className="border-t border-border mt-4" />
      </>
    )
  }

  if (isError || !post) {
    return (
      <>
        <Breadcrumb to={getReturnUrl()} label="Back" />
        <div className="py-8">
          <ErrorEmpty
            title="Post not found"
            description="The post you're looking for doesn't exist or has been deleted."
          />
        </div>
      </>
    )
  }

  return (
    <>
       <Breadcrumb to={getReturnUrl()} label="Back" />
      <div className="border-b border-border">
        <PostCard post={post} readOnly={false} disableNavigation={true} isPostView={true} />
      </div>

      <InlineCommentForm 
        postId={post.id}
        placeholder="Post your reply"
      />

      <div>
        <CommentsList postId={post.id} />
      </div>
    </>
  )
}


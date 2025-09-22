import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPostApi } from '@/api/posts'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { PostCard } from '@/components/posts/PostCard'
import { PostLoadingSkeleton } from '@/components/posts/PostLoadingSkeleton'

export function PostView() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  const { data: postData, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostApi(postId!),
    enabled: !!postId,
  })


  if (postLoading) {
    return (
      <>
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="max-w-2xl mx-auto">
          <PostLoadingSkeleton count={1} />
        </div>
      </>
    )
  }

  if (postError || !postData?.post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    )
  }

  const post = postData.post

  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Post</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <PostCard 
          post={post} 
          className="mb-6"
          showComments={true}
          onPostDeleted={() => navigate('/dashboard')}
          disableHover={true}
        />
      </div>
    </>
  )
}

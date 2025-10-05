import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPostApi } from '@/api/posts'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { PostCard } from '@/components/app/posts/PostCard'
import { PostLoadingSkeleton } from '@/components/app/posts/PostLoadingSkeleton'
import { createSmartNavigationHandler, useNavigationTracking } from '@/utils/navigation'

export function PostView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  useNavigationTracking(`/post/${id}`)
  
  const handleBack = () => {
    const smartHandler = createSmartNavigationHandler(
      navigate,
      `/post/${id}`,
      '/feed'
    )
    smartHandler([`/post/${id}/comment/`])
  }

  const { data: postData, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostApi(id!),
    enabled: !!id,
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
          onClick={handleBack}
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
          onPostDeleted={() => navigate('/feed')}
          disableHover={true}
          showDetailedTimestamp={true}
        />
      </div>
    </>
  )
}

export default PostView

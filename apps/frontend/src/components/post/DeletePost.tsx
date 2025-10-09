import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { deletePostApi } from '@/api/posts'
import { toast } from 'sonner'
import type { Post } from '@/api/posts'

interface DeletePostProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post
}

export function DeletePost({ open, onOpenChange, post }: DeletePostProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const deletePostMutation = useMutation({
    mutationFn: deletePostApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ 
        queryKey: ['user-posts'],
        refetchType: 'active'
      })
      
      await queryClient.invalidateQueries({ 
        queryKey: ['posts'],
        refetchType: 'active'
      })
      
      queryClient.removeQueries({ 
        queryKey: ['post', post.id]
      })
      
      onOpenChange(false)
      toast.success('Post deleted successfully')
      
      if (location.pathname === `/post/${post.id}`) {
        const searchParams = new URLSearchParams(location.search)
        const returnUrl = searchParams.get('return')
        
        if (returnUrl) {
          navigate(returnUrl)
        } 
        else {
          navigate('/feed')
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete post')
    }
  })

  const handleDeletePost = () => {
    deletePostMutation.mutate(post.id)
  }

  const actionButton = (
    <Button
      variant="destructive"
      onClick={(e) => {
        e.stopPropagation()
        handleDeletePost()
      }}
      disabled={deletePostMutation.isPending}
      className="flex-1"
    >
      Delete
    </Button>
  )

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ResponsiveModal
        isOpen={open}
        onClose={() => onOpenChange(false)}
        title="Delete post?"
        description="This action cannot be undone."
        onCancel={() => onOpenChange(false)}
        cancelText="Cancel"
        actionButton={actionButton}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this post? This action is permanent and cannot be undone.
        </p>
      </ResponsiveModal>
    </div>
  )
}


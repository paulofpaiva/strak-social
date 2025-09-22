import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { useAuth } from '@/hooks'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { type Comment } from '@/api/posts'
import { DeleteCommentModal } from './DeleteCommentModal'
import { EditCommentModal } from './EditCommentModal'

interface CommentActionsProps {
  comment: Comment
  postId: string
  redirectToPostOnDelete?: boolean
}

export function CommentActions({ comment, postId, redirectToPostOnDelete = false }: CommentActionsProps) {
  const { user } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const isMyComment = user?.id === comment.userId

  if (!isMyComment) return null

  return (
    <>
      <ResponsiveDropdown
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        }
        items={[
          {
            label: 'Edit',
            icon: <Edit className="h-4 w-4" />,
            onClick: () => setShowEditModal(true)
          },
          {
            label: 'Delete',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => setShowDeleteModal(true),
            variant: 'destructive'
          }
        ]}
      />

      {showEditModal && (
        <EditCommentModal
          comment={comment}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteCommentModal
          commentId={comment.id}
          postId={postId}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          redirectToPost={redirectToPostOnDelete}
        />
      )}
    </>
  )
}

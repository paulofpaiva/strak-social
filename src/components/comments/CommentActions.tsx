import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation()
            setShowEditModal(true)
          }}>
            <Edit className="h-3 w-3 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteModal(true)
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

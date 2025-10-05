import { useCreatePost } from '@/contexts/CreatePostContext'
import { CreatePostModal } from './CreatePostModal'

export function GlobalCreatePostModal() {
  const { isOpen, closeModal } = useCreatePost()

  return (
    <CreatePostModal
      isOpen={isOpen}
      onClose={closeModal}
    />
  )
}

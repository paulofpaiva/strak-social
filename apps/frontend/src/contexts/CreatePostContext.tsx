import { createContext, useContext, useState, ReactNode } from 'react'
import { CreatePost } from '@/components/post/CreatePost'

interface CreatePostContextType {
  openCreatePost: () => void
  closeCreatePost: () => void
  isOpen: boolean
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined)

export function CreatePostProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCreatePost = () => setIsOpen(true)
  const closeCreatePost = () => setIsOpen(false)

  return (
    <CreatePostContext.Provider value={{ openCreatePost, closeCreatePost, isOpen }}>
      {children}
      <CreatePost open={isOpen} onOpenChange={setIsOpen} />
    </CreatePostContext.Provider>
  )
}

export function useCreatePost() {
  const context = useContext(CreatePostContext)
  if (context === undefined) {
    throw new Error('useCreatePost must be used within a CreatePostProvider')
  }
  return context
}

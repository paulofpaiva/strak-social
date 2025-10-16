import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Check, Lock, NotebookText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useInfiniteScroll } from '@/hooks'
import { useLists } from '@/hooks/list/useLists'
import { getPostListsApi, List } from '@/api/lists'
import { useSavePostToLists } from '@/hooks/list/useSavePostToLists'
import { toast } from 'sonner'

interface SaveToListsModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
}

export function SaveToListsModal({ isOpen, onClose, postId }: SaveToListsModalProps) {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([])

  const { data: postListsData, isLoading: postListsLoading } = useQuery({
    queryKey: ['postLists', postId],
    queryFn: () => getPostListsApi(postId),
    enabled: isOpen && !!postId,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const {
    data: listsData,
    isLoading: listsLoading,
    isError: listsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLists()

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  const allLists = listsData?.pages.flatMap((page) => page.lists) || []
  const lists = Array.from(
    new Map(allLists.map(list => [list.id, list])).values()
  )

  const saveMutation = useSavePostToLists()

  useEffect(() => {
    if (postListsData?.listIds) {
      setSelectedListIds(postListsData.listIds)
    }
  }, [postListsData])

  const handleListToggle = (listId: string) => {
    setSelectedListIds(prev => 
      prev.includes(listId) 
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    )
  }

  const handleSave = () => {
    if (!hasChanges()) {
      toast.error('No changes to save')
      return
    }
    saveMutation.mutate({ postId, listIds: selectedListIds }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const isLoading = postListsLoading || listsLoading
  
  const hasChanges = () => {
    if (!postListsData?.listIds) return selectedListIds.length > 0
    const originalIds = postListsData.listIds.sort()
    const currentIds = selectedListIds.sort()
    return JSON.stringify(originalIds) !== JSON.stringify(currentIds)
  }

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add/Remove from Lists"
      description="Select the lists where you want to save this post"
      actionButton={
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending || !hasChanges()}
          className="flex-1"
        >
          Save
        </Button>
      }
      onCancel={onClose}
      cancelText="Cancel"
      className="sm:max-w-[500px]"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : listsError ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Failed to load lists</p>
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">You don't have any lists yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {lists.map((list) => (
              <div
                key={list.id}
                onClick={() => handleListToggle(list.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  "hover:bg-accent/50",
                  selectedListIds.includes(list.id) && "bg-accent"
                )}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                    {list.coverUrl ? (
                      <img 
                        src={list.coverUrl} 
                        alt={list.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <NotebookText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {list.title}
                    </h4>
                    {list.isPrivate && (
                      <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  
                  {list.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {list.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <Avatar 
                      src={list.owner.avatar || undefined} 
                      name={list.owner.name}
                      size="sm"
                      className="h-3 w-3"
                    />
                    <span className="text-xs text-muted-foreground">
                      @{list.owner.username}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {selectedListIds.includes(list.id) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            ))}

            {hasNextPage && (
              <div ref={sentinelRef} className="flex justify-center py-4">
                {isFetchingNextPage && (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ResponsiveModal>
  )
}

import { useState, useEffect } from 'react'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { SearchInput } from '@/components/ui/search-input'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2, UserMinus, Shield } from 'lucide-react'
import { useListMembers } from '@/hooks/list/useListDetails'
import { useRemoveMember } from '@/hooks/list/useListMutations'
import { UserListSkeleton } from '@/components/skeleton/UserListSkeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { Users } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useInfiniteScroll } from '@/hooks'

interface ManageMembersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listId: string
  isOwner: boolean
}

export function ManageMembersModal({ open, onOpenChange, listId, isOwner }: ManageMembersModalProps) {
  const [membersSearchQuery, setMembersSearchQuery] = useState('')
  const { user: currentUser } = useAuthStore()

  const {
    data: membersData,
    isLoading: membersLoading,
    fetchNextPage: fetchNextMembers,
    hasNextPage: hasNextMembers,
    isFetchingNextPage: isFetchingNextMembers
  } = useListMembers(listId, membersSearchQuery)

  const removeMemberMutation = useRemoveMember()

  const allMembersPages = membersData?.pages.flatMap(page => page.members) || []
  const members = Array.from(
    new Map(allMembersPages.map(m => [m.id, m])).values()
  )
  const owner = membersData?.pages[0]?.owner


  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMemberMutation.mutateAsync({ listId, userId })
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.warn(error.response.data.message)
        return
      }
      throw error
    }
  }

  const membersSentinelRef = useInfiniteScroll(
    () => fetchNextMembers(),
    hasNextMembers || false,
    isFetchingNextMembers
  )


  useEffect(() => {
    if (!open) {
      setMembersSearchQuery('')
    }
  }, [open])

  return (
    <ResponsiveModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Manage Members"
      description="View and remove members from this list"
      onCancel={() => onOpenChange(false)}
      cancelText="Close"
      className="max-w-md w-full mx-4"
    >
      <div className="mt-4 space-y-3 max-h-[calc(100vh-1rem)] md:max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-1">
          <SearchInput
            value={membersSearchQuery}
            onChange={setMembersSearchQuery}
            placeholder="Search members..."
          />
          
          {membersLoading ? (
            <UserListSkeleton />
          ) : (
            <>
              {owner && (
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar 
                      src={owner.avatar || undefined}
                      name={owner.name}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{owner.name}</p>
                        <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">@{owner.username}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">Owner</span>
                </div>
              )}

              {members.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Users className="h-6 w-6" />
                    </EmptyMedia>
                    <EmptyTitle>
                      {membersSearchQuery.trim().length > 0 ? 'No members found' : 'No members yet'}
                    </EmptyTitle>
                    <EmptyDescription>
                      {membersSearchQuery.trim().length > 0 
                        ? 'Try searching with different keywords'
                        : 'Add members to this list from the "Add Members" tab'
                      }
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-2">
                  {members.map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar 
                          src={member.avatar || undefined}
                          name={member.name}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">@{member.username}</p>
                        </div>
                      </div>
                      {(isOwner || member.id === currentUser?.id) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removeMemberMutation.isPending}
                          className="rounded-full flex-shrink-0 ml-2"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {hasNextMembers && (
                <div ref={membersSentinelRef} className="flex justify-center py-4">
                  {isFetchingNextMembers && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  )}
                </div>
              )}
            </>
          )}
      </div>
    </ResponsiveModal>
  )
}


import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Users, Lock, UserPlus, UserMinus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { ResponsiveDropdown } from '@/components/ui/responsive-dropdown'
import { ResponsiveModal } from '@/components/ui/responsive-modal'
import { useListDetails } from '@/hooks/list/useListDetails'
import { useListPosts } from '@/hooks/list/useListPosts'
import { useDeleteList, useFollowList, useUnfollowList } from '@/hooks/list/useListMutations'
import { ListDetailsSkeleton } from '@/components/skeleton/ListDetailsSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { ManageMembersModal } from '@/components/list/ManageMembersModal'
import { PostCard } from '@/components/post/PostCard'
import { useInfiniteScroll } from '@/hooks'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { Loader2 } from 'lucide-react'

export function ListDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [manageMembersOpen, setManageMembersOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useListDetails(id)
  const deleteListMutation = useDeleteList()
  const followListMutation = useFollowList()
  const unfollowListMutation = useUnfollowList()

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchPosts,
  } = useListPosts(id)

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    hasNextPage || false,
    isFetchingNextPage
  )

  const allPosts = postsData?.pages.flatMap((page: any) => page.posts) || []
  const posts = Array.from(
    new Map(allPosts.map(post => [post.id, post])).values()
  )

  const list = data?.list

  const handleDelete = async () => {
    if (!id) return
    await deleteListMutation.mutateAsync(id)
    navigate('/lists')
  }

  const handleFollow = async () => {
    if (!id) return
    await followListMutation.mutateAsync(id)
  }

  const handleUnfollow = async () => {
    if (!id) return
    await unfollowListMutation.mutateAsync(id)
  }

  if (isLoading) {
    return <ListDetailsSkeleton />
  }

  if (isError || !list) {
    return (
      <ErrorEmpty
        title="Failed to load list"
        description="Unable to load list details. Please try again."
        onRetry={() => refetch()}
        retryText="Try again"
      />
    )
  }

  return (
    <>
      <div className="flex flex-col border-b">
        <div className="h-48 sm:h-48 md:h-64 w-full bg-muted overflow-hidden relative">
          {list.coverUrl ? (
            <img
              src={list.coverUrl}
              alt={list.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600" />
          )}
        </div>

        {/* List Info */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{list.title}</h2>
                  {list.isPrivate && (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                {list.description && (
                  <p className="text-muted-foreground">{list.description}</p>
                )}
              </div>
              {list.isOwner && (
                <ResponsiveDropdown
                  trigger={
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  }
                  items={[
                    {
                      label: 'Edit',
                      icon: <Edit className="h-4 w-4" />,
                      onClick: () => navigate(`/lists/${id}/edit`)
                    },
                    {
                      label: 'Manage Members',
                      icon: <Users className="h-4 w-4" />,
                      onClick: () => setManageMembersOpen(true)
                    },
                    {
                      label: 'Delete',
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => setDeleteDialogOpen(true),
                      variant: 'destructive'
                    }
                  ]}
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar 
                src={list.owner.avatar || undefined}
                name={list.owner.name}
                size="md"
              />
              <div>
                <p className="font-medium text-sm">{list.owner.name}</p>
                <p className="text-xs text-muted-foreground">@{list.owner.username}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{list.membersCount} {list.membersCount === 1 ? 'member' : 'members'}</span>
              </div>

              {!list.isOwner && list.isMember ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  onClick={handleUnfollow}
                  disabled={unfollowListMutation.isPending}
                >
                  Unfollow
                </Button>
              ) : !list.isOwner && !list.isMember ? (
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={handleFollow}
                  disabled={followListMutation.isPending}
                >
                  Follow
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-4">
        <div className="space-y-4">
          {postsLoading ? (
            <PostCardSkeleton count={3} />
          ) : postsError ? (
            <ErrorEmpty
              title="Failed to load posts"
              description="Unable to load posts from this list. Please try again."
              onRetry={() => refetchPosts()}
              retryText="Try again"
            />
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No posts in this list yet</p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  listContext={{
                    listId: id!,
                    isOwner: list.isOwner
                  }}
                />
              ))}
              
              {hasNextPage && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                  {isFetchingNextPage && (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {list.isOwner && (
        <ManageMembersModal
          open={manageMembersOpen}
          onOpenChange={setManageMembersOpen}
          listId={id!}
          isOwner={list.isOwner}
        />
      )}

      <ResponsiveModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete List"
        description="Are you sure you want to delete this list? This action cannot be undone."
        actionButton={
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteListMutation.isPending}
            className="flex-1"
          >
            Delete
          </Button>
        }
        onCancel={() => setDeleteDialogOpen(false)}
        cancelText="Cancel"
      >
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This will permanently delete "<strong>{list.title}</strong>" and all its members.
          </p>
        </div>
      </ResponsiveModal>
    </>
  )
}


import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListForm } from '@/components/list/ListForm'
import { useUpdateList } from '@/hooks/list/useListMutations'
import { useListDetails } from '@/hooks/list/useListDetails'
import { useNavigationState } from '@/hooks/useNavigationState'
import { CreateListFormData } from '@/schemas/list'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { ErrorEmpty } from '@/components/ErrorEmpty'

export function EditList() {
  const { id } = useParams<{ id: string }>()
  const { navigateWithReturn, navigateBack } = useNavigationState()
  const updateListMutation = useUpdateList()
  const { data, isLoading, isError, refetch } = useListDetails(id)

  const list = data?.list

  const handleSubmit = async (data: CreateListFormData) => {
    if (!id) return
    await updateListMutation.mutateAsync({ id, data })
    navigateWithReturn(`/lists/${id}`, { replace: true })
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <PostCardSkeleton count={1} />
      </div>
    )
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

  if (!list.isOwner) {
    return (
      <ErrorEmpty
        title="Access denied"
        description="You don't have permission to edit this list."
        onRetry={() => navigateBack()}
        retryText="Go back"
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-4 p-4">
          <h1 className="text-xl font-bold">Edit list</h1>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-4xl w-full sm:mx-0 md:mx-0 lg:mx-0">
        <ListForm
          defaultValues={{
            title: list.title,
            description: list.description,
            coverUrl: list.coverUrl,
            isPrivate: list.isPrivate,
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateListMutation.isPending}
          showSubmitButton={true}
        />
      </div>
    </div>
  )
}


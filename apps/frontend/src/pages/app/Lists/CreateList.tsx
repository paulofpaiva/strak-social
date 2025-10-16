import { ListForm } from '@/components/list/ListForm'
import { useCreateList } from '@/hooks/list/useListMutations'
import { useNavigationState } from '@/hooks/useNavigationState'
import { CreateListFormData } from '@/schemas/list'

export function CreateList() {
  const { navigateWithReturn } = useNavigationState()
  const createListMutation = useCreateList()

  const handleSubmit = async (data: CreateListFormData) => {
    await createListMutation.mutateAsync(data)
    navigateWithReturn('/lists')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80">
        <div className="flex items-center gap-4 p-4">
          <h1 className="text-xl font-bold">New list</h1>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-4xl w-full sm:mx-0 md:mx-0 lg:mx-0">
        <ListForm
          onSubmit={handleSubmit}
          isSubmitting={createListMutation.isPending}
          showSubmitButton={true}
        />
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, NotebookText, Loader2 } from 'lucide-react'
import { useLists } from '@/hooks/list/useLists'
import { ListCard } from '@/components/list/ListCard'
import { useInfiniteScroll } from '@/hooks'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { PostCardSkeleton } from '@/components/skeleton/PostCardSkeleton'
import { SearchInput } from '@/components/ui/search-input'
import { List } from '@/api/lists'

export function Lists() {
  const navigate = useNavigate()

  const {
    data: listsData,
    isLoading: listsLoading,
    isError: listsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchLists
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


  return (
    <>
      <div className="w-full flex items-center justify-between gap-2">
         <SearchInput
           value=""
           onChange={() => {}}
           placeholder="Search lists..."
           className="flex-1"
         />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate('/lists/new')}
          className="flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
        </Button>
      </div>

       <div className="flex flex-col">
         <div className="p-4 space-y-4">
           <h2 className="text-lg font-semibold">Your Lists</h2>
           
           {listsLoading ? (
             <PostCardSkeleton count={3} />
           ) : listsError ? (
             <ErrorEmpty
               title="Failed to load lists"
               description="Unable to load lists. Please try again."
               onRetry={() => refetchLists()}
               retryText="Try again"
             />
           ) : lists.length === 0 ? (
             <Empty className="mt-8">
               <EmptyHeader>
                 <EmptyMedia variant="icon">
                   <NotebookText className="h-6 w-6" />
                 </EmptyMedia>
                 <EmptyTitle>No lists yet</EmptyTitle>
                 <EmptyDescription>
                   Create your first list to organize content and users
                 </EmptyDescription>
               </EmptyHeader>
             </Empty>
           ) : (
             <>
               <div className="space-y-3">
                 {lists.map((list: List) => (
                   <ListCard key={list.id} list={list} />
                 ))}
               </div>

               {hasNextPage && (
                 <div ref={sentinelRef} className="flex justify-center py-4">
                   {isFetchingNextPage && (
                     <Loader2 className="h-6 w-6 animate-spin text-primary" />
                   )}
                 </div>
               )}
             </>
           )}
         </div>
       </div>
    </>
  )
}


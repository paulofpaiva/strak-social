import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SearchInput } from '@/components/ui/search-input'
import { BookmarksList } from '@/pages/app/Profile/components/BookmarksList'
import { useSearchNavigation } from '@/hooks'

export function Bookmarks() {
  const { searchParams, navigateWithParams } = useSearchNavigation({
    basePath: '/bookmarks',
    defaultReturnPath: '/bookmarks'
  })

  const search = searchParams.get('q') || ''

  const handleSearchChange = (value: string) => {
    navigateWithParams({ q: value.trim() ? value : null })
  }

  return (
    <div className="container mx-auto">
      <Breadcrumb to="/feed" label="Bookmarks" />
      
      <div className="px-4 py-6">
        <div className="mb-6 w-full max-w-md">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search bookmarks..."
          />
        </div>
        
        <BookmarksList search={search} />
      </div>
    </div>
  )
}


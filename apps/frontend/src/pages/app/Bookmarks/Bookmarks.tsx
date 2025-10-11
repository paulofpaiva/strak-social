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
    <>
      <div className="w-full md:w-96">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          placeholder="Search bookmarks..."
        />
      </div>

      <BookmarksList search={search} />
    </>
  )
}


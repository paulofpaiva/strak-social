export function ProfileSkeleton() {
  return (
    <div className="container mx-auto overflow-x-hidden">
      <div className="relative -mx-4 sm:mx-0">
        <div className="h-32 sm:h-48 md:h-64 w-full bg-muted"></div>
        
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-muted rounded-full border-4 border-background"></div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-muted rounded"></div>
        </div>
      </div>

      <div className="mt-14 sm:mt-20 px-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-32 bg-muted rounded"></div>
              <div className="h-4 w-20 bg-muted rounded"></div>
            </div>
            <div className="h-4 w-24 bg-muted rounded"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </div>
          <div className="h-8 w-24 bg-muted rounded"></div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-4 w-16 bg-muted rounded"></div>
          <div className="h-4 w-16 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="h-64 w-full bg-muted"></div>
        
        <div className="absolute -bottom-12 left-6">
          <div className="w-32 h-32 bg-muted rounded-full border-4 border-background"></div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-muted rounded"></div>
        </div>
      </div>

      <div className="mt-16 px-4 space-y-4">
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

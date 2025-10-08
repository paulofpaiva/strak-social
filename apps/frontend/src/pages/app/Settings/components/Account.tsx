import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfileApi } from '@/api/profile'
import { formatDate } from '@/utils/date'
import { 
  Item, 
  ItemContent, 
  ItemDescription, 
  ItemTitle,
  ItemGroup,
  ItemSeparator,
  ItemActions
} from '@/components/ui/item'
import { ErrorEmpty } from '@/components/ErrorEmpty'
import { SkeletonItemGroup } from '@/components/skeleton/SkeletonItemGroup'
import { Button } from '@/components/ui/button'
import { ChevronRight, Lock } from 'lucide-react'
import { ChangePassword } from './ChangePassword'

export function Account() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  
  const { data: profileData, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const user = profileData?.user

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account information, password, and privacy preferences.
        </p>
      </div>
      {isLoading && (
        <SkeletonItemGroup itemCount={5} />
      )}

      {error || !profileData ? (
        <ErrorEmpty
          title="Failed to load data"
          description="Unable to load account information. Please check your connection and try again."
          onRetry={() => refetch()}
          retryText="Try again"
        />
      ) : (
        <ItemGroup className='px-0'>
          <Item 
            className="cursor-pointer transition-colors px-0"
          >
            <ItemContent>
              <ItemTitle>Full Name</ItemTitle>
              <ItemDescription>{user.name}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>
          <ItemSeparator />

          <Item 
            className="cursor-pointer transition-colors px-0"
          >
            <ItemContent>
              <ItemTitle>Username</ItemTitle>
              <ItemDescription>@{user.username}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>
          <ItemSeparator />

          <Item 
            className="cursor-pointer transition-colors px-0"
          >
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
              <ItemDescription>{user.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>
          <ItemSeparator />

          <Item 
            className="cursor-pointer transition-colors px-0"
          >
            <ItemContent>
              <ItemTitle>Birth Date</ItemTitle>
              <ItemDescription>
                {user.birthDate 
                  ? `${formatDate(user.birthDate)}` 
                  : 'Not provided'
                }
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </ItemActions>
          </Item>
          <ItemSeparator />
          <ItemSeparator />
          <Item 
            className="cursor-pointer transition-colors px-0"
          >
            <ItemContent>
              <ItemTitle>Member Since</ItemTitle>
              <ItemDescription>{formatDate(user.createdAt)}</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      )}
      
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">Security</h3>
          <p className="text-sm text-muted-foreground">
            Manage your password and security settings.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsChangePasswordOpen(true)}
          variant="outline"
          size="sm"
          className="w-fit"
        >
          <Lock className="h-4 w-4 mr-2" />
          Change Password
        </Button>
      </div>
      
      <ChangePassword 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  )
}

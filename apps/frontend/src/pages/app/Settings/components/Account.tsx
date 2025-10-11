import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfileApi, updateNameApi, updateUsernameApi, updateBirthDateApi } from '@/api/profile'
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
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Lock } from 'lucide-react'
import { ChangePassword } from './ChangePassword'
import { EditFieldModal } from './EditFieldModal'
import { editNameSchema, editUsernameSchema, editBirthDateSchema } from '@/schemas/profile'

export function Account() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [editingField, setEditingField] = useState<'name' | 'username' | 'birthDate' | null>(null)
  const queryClient = useQueryClient()
  
  const { data: profileData, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const user = profileData?.user

  const handleSaveName = async (name: string) => {
    await updateNameApi(name)
    await queryClient.invalidateQueries({ queryKey: ['profile'] })
  }

  const handleSaveUsername = async (username: string) => {
    await updateUsernameApi(username)
    await queryClient.invalidateQueries({ queryKey: ['profile'] })
  }

  const handleSaveBirthDate = async (birthDate: string) => {
    await updateBirthDateApi(birthDate)
    await queryClient.invalidateQueries({ queryKey: ['profile'] })
  }

  const formatBirthDateForInput = (date: Date | string | null) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

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
            className="cursor-pointer transition-colors hover:bg-accent px-0"
            onClick={() => setEditingField('name')}
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
            className="cursor-pointer transition-colors hover:bg-accent px-0"
            onClick={() => setEditingField('username')}
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
            className="px-0"
          >
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
              <ItemDescription className="flex flex-col gap-1">
                <span>{user.email}</span>
                <Badge variant="default" className="text-xs w-fit bg-green-600 hover:bg-green-600">
                  Email changes coming soon
                </Badge>
              </ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator />

          <Item 
            className="cursor-pointer transition-colors hover:bg-accent px-0"
            onClick={() => setEditingField('birthDate')}
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
            className="px-0"
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
      
      <EditFieldModal
        open={editingField === 'name'}
        onOpenChange={(open) => !open && setEditingField(null)}
        fieldName="name"
        fieldLabel="Full Name"
        fieldType="text"
        currentValue={user?.name || ''}
        schema={editNameSchema}
        onSave={handleSaveName}
      />

      <EditFieldModal
        open={editingField === 'username'}
        onOpenChange={(open) => !open && setEditingField(null)}
        fieldName="username"
        fieldLabel="Username"
        fieldType="text"
        currentValue={user?.username || ''}
        schema={editUsernameSchema}
        onSave={handleSaveUsername}
        showUsernameCheck={true}
      />

      <EditFieldModal
        open={editingField === 'birthDate'}
        onOpenChange={(open) => !open && setEditingField(null)}
        fieldName="birthDate"
        fieldLabel="Birth Date"
        fieldType="date"
        currentValue={formatBirthDateForInput(user?.birthDate || null)}
        schema={editBirthDateSchema}
        onSave={handleSaveBirthDate}
      />
    </div>
  )
}

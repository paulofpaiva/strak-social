import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks"
import { useToastContext } from "@/contexts/ToastContext"
import { ChangePasswordModal } from "./ChangePasswordModal"

export function AccountSettings() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const { logout } = useAuth()
  const { success: toastSuccess, error: toastError } = useToastContext()

  const handleLogout = async () => {
    try {
      await logout()
      toastSuccess('Logged out successfully!')
    } catch (error: any) {
      toastError(error.message || 'Error logging out')
    }
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Account
        </CardTitle>
        <CardDescription>
          Manage your account settings and security preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Update your password to keep your account secure.
          </p>
          
          <div className="flex justify-start">
            <Button
              onClick={() => setIsPasswordModalOpen(true)}
              variant="outline"
            >
              Change Password
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Sign Out</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Sign out of your account on this device.
          </p>
          
          <div className="flex justify-start">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </Card>
  )
}
import { AccountSettings } from "../../../components/app/settings/AccountSettings"
import { AppearanceSettings } from "../../../components/app/settings/AppearanceSettings"
import { SettingsTabs } from "@/components/navigation/SettingsTabs"
import { SettingsSidebar } from "@/components/navigation/SettingsSidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useState } from "react"
import { useNavigationTracking, createSmartNavigationHandler } from '@/utils/navigation'

type SettingsTab = "account" | "appearance"

export function Settings() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")
  
  useNavigationTracking('/settings')
  
  const handleBack = () => {
    const smartHandler = createSmartNavigationHandler(
      navigate,
      '/settings',
      '/feed'
    )
    smartHandler([])
  }

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />
      case "appearance":
        return <AppearanceSettings />
      default:
        return <AccountSettings />
    }
  }

  const getTitle = () => {
    switch (activeTab) {
      case "account":
        return "Account Settings"
      case "appearance":
        return "Appearance Settings"
      default:
        return "Account Settings"
    }
  }

  const getDescription = () => {
    switch (activeTab) {
      case "account":
        return "Manage your account settings and security preferences."
      case "appearance":
        return "Customize your app appearance and theme preferences."
      default:
        return "Manage your account settings and preferences."
    }
  }

  if (isMobile) {
    return (
      <>
        <div className="mb-4">
          <div className="flex items-center space-x-4 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          </div>
          <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
          <p className="text-muted-foreground text-sm">{getDescription()}</p>
        </div>

        <div className="space-y-4">
          <SettingsTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as SettingsTab)} />
          <div className="w-full">
            {renderContent()}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
        <h2 className="text-3xl font-bold mb-2">{getTitle()}</h2>
        <p className="text-muted-foreground">{getDescription()}</p>
      </div>

      <div className="flex gap-8">
        <div className="flex-shrink-0">
          <SettingsSidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as SettingsTab)} />
        </div>
        
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </>
  )
}

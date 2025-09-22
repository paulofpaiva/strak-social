import { AccountSettings } from "./components/AccountSettings"
import { AppearanceSettings } from "./components/AppearanceSettings"
import { SettingsTabs } from "@/components/navigation/SettingsTabs"
import { SettingsSidebar } from "@/components/navigation/SettingsSidebar"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useState } from "react"

type SettingsTab = "account" | "appearance"

export function Settings() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")

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
            <Breadcrumb to="/dashboard" label="Back" className="h-12 px-6 text-base" />
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
          <Breadcrumb to="/dashboard" label="Back" className="h-12 px-6 text-base" />
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

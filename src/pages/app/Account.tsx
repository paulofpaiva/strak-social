import { SettingsLayout } from "@/layouts/SettingsLayout"
import { AccountSettings } from "./settings/AccountSettings"

export function Account() {
  return (
    <SettingsLayout 
      title="Settings" 
      description="Manage your account settings and set e-mail preferences."
    >
      <AccountSettings />
    </SettingsLayout>
  )
}

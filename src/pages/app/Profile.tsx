import { SettingsLayout } from "@/layouts/SettingsLayout"
import { ProfileSettings } from "./settings/ProfileSettings"

export function Profile() {
  return (
    <SettingsLayout 
      title="Settings" 
      description="Manage your account settings and set e-mail preferences."
    >
      <ProfileSettings />
    </SettingsLayout>
  )
}

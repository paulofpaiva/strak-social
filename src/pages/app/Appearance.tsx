import { SettingsLayout } from "@/layouts/SettingsLayout"
import { AppearanceSettings } from "./settings/AppearanceSettings"

export function Appearance() {
  return (
    <SettingsLayout 
      title="Settings" 
      description="Manage your account settings and set e-mail preferences."
    >
      <AppearanceSettings />
    </SettingsLayout>
  )
}

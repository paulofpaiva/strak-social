import { useState } from 'react'

export function useTogglePassword() {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return {
    showPassword,
    togglePassword,
  }
}

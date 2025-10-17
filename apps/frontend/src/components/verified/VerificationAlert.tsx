import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export function VerificationAlert() {
  return (
    <Alert className="bg-gradient-to-r from-purple-50 to-purple-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800 w-fit max-w-md min-h-[120px] py-4">
      <Crown className="h-5 w-5 text-purple-600 dark:text-purple-500" />
      <AlertTitle className="text-purple-900 dark:text-purple-100 font-semibold">
        You are not verified yet
      </AlertTitle>
      <AlertDescription className="text-purple-800 dark:text-purple-200 mt-2 space-y-3">
        <p>
          Get verified and unlock premium features like greater visibility, advanced analytics, and priority support.
        </p>
      </AlertDescription>
    </Alert>
  )
}

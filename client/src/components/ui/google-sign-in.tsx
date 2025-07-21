import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

interface GoogleSignInProps {
  onSignIn?: () => void
  className?: string
}

export function GoogleSignIn({ onSignIn, className }: GoogleSignInProps) {
  const handleSignIn = () => {
    // TODO: Implement Google OAuth flow
    console.log("Google Sign In clicked")
    onSignIn?.()
  }

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      className={`w-full ${className}`}
    >
      <Chrome className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  )
}

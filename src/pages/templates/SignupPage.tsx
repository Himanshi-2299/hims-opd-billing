import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "../../app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../app/components/ui/card"
import { Input } from "../../app/components/ui/input"
import { Label } from "../../app/components/ui/label"
import { Separator } from "../../app/components/ui/separator"
import { Checkbox } from "../../app/components/ui/checkbox"
import { Lock, Mail, User, Sparkles } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../lib/constants"

/**
 * Signup Page Template
 * 
 * A standard signup/registration page template with email, password, and name fields.
 * Features:
 * - Logo/branding area
 * - Muted background for visual hierarchy
 * - Semantic spacing throughout
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <SignupPage 
 *   onSignup={(data) => handleSignup(data)}
 *   showLoginLink={true}
 *   loginLink="/login"
 * />
 * ```
 */
interface SignupPageProps {
  onSignup?: (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => void
  showLoginLink?: boolean
  loginLink?: string
  logo?: React.ReactNode
  logoText?: string
}

export function SignupPage({
  onSignup,
  showLoginLink = true,
  loginLink = "/login",
  logo,
  logoText = "IQLine Inc.",
}: SignupPageProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [acceptTerms, setAcceptTerms] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (!acceptTerms) {
      alert("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    
    try {
      if (onSignup) {
        await onSignup({ name, email, password, confirmPassword })
      } else {
        // Default behavior - replace with your auth logic
        console.log("Signup:", { name, email, password })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo Area */}
        {(logo || logoText) && (
          <div className="flex items-center justify-center gap-2">
            {logo || (
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Sparkles strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
              </div>
            )}
            {logoText && (
              <span className="text-lg font-semibold">{logoText}</span>
            )}
          </div>
        )}

        {/* Signup Card */}
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold">Create an account</CardTitle>
            <CardDescription>
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User
                    strokeWidth={ICON_STROKE_WIDTH}
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail
                    strokeWidth={ICON_STROKE_WIDTH}
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock
                    strokeWidth={ICON_STROKE_WIDTH}
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock
                    strokeWidth={ICON_STROKE_WIDTH}
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              {showLoginLink && (
                <>
                  <div className="relative w-full">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-card px-3 text-xs text-muted-foreground">
                        OR
                      </span>
                    </div>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to={loginLink} className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </form>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

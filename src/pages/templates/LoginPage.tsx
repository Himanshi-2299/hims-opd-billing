import * as React from "react"
import { Link } from "react-router-dom"
import { LoginForm } from "../../app/components/blocks/login-form"
import { Sparkles } from "lucide-react"
import { ICON_STROKE_WIDTH } from "../../lib/constants"

/**
 * Login Page Template
 * 
 * A standard login page template with email/password fields.
 * Features:
 * - Logo/branding area
 * - Muted background for visual hierarchy
 * - Semantic spacing throughout
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <LoginPage 
 *   onLogin={(email, password) => handleLogin(email, password)}
 *   showSignupLink={true}
 *   signupLink="/signup"
 * />
 * ```
 */
interface LoginPageProps {
  onLogin?: (email: string, password: string) => void
  onGoogleLogin?: () => void
  showSignupLink?: boolean
  signupLink?: string
  showForgotPassword?: boolean
  forgotPasswordLink?: string
  logo?: React.ReactNode
  logoText?: string
}

export function LoginPage({
  onLogin,
  onGoogleLogin,
  showSignupLink = true,
  signupLink = "/signup",
  showForgotPassword = true,
  forgotPasswordLink = "/forgot-password",
  logo,
  logoText = "IQLine Inc.",
}: LoginPageProps) {
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

        {/* Login Form */}
        <LoginForm
          onLogin={onLogin}
          onGoogleLogin={onGoogleLogin}
          showSignupLink={showSignupLink}
          signupLink={signupLink}
          showForgotPassword={showForgotPassword}
          forgotPasswordLink={forgotPasswordLink}
        />

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

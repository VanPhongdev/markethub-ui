'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface LoginFormProps {
  onError?: () => void
  onSuccess?: (url: string) => void
  onSwitchRegister?: () => void
}

export function LoginForm({ onError, onSuccess, onSwitchRegister }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setUnverifiedEmail(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresEmailVerification) {
          setUnverifiedEmail(email)
          setError(null)
          onError?.()
        } else {
          setError(data.error || 'Login failed. Please try again.')
          onError?.()
        }
      } else {
        // Store email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('marketHub_rememberEmail', email)
        } else {
          localStorage.removeItem('marketHub_rememberEmail')
        }
        
        // Redirect to dashboard or home
        if (onSuccess) {
          onSuccess('/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      onError?.()
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail }),
      })

      if (response.ok) {
        setError(null)
        setUnverifiedEmail(null)
        setSuccessMsg('Verification email sent! Please check your inbox.')
      } else {
        setError('Failed to resend verification email.')
      }
    } catch (err) {
      console.error('Resend verification error:', err)
      setError('An error occurred. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // In a real app, this would redirect to OAuth provider
      const response = await fetch('/api/auth/google', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (err) {
      console.error('Google auth error:', err)
      setError('Google sign-in is not available at this time.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Banner */}
      {successMsg && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="size-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Error Banner */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Email Not Verified Warning */}
      {unverifiedEmail && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>
              Please verify your email address to continue. We&apos;ve sent a verification email to <strong>{unverifiedEmail}</strong>
            </span>
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-sm font-semibold text-primary hover:underline text-left"
            >
              Didn&apos;t receive it? Resend verification email
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="bg-background"
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="bg-background pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLoading}
          />
          <label
            htmlFor="remember"
            className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
          >
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        size="lg"
      >
        <svg className="mr-2 size-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        {onSwitchRegister ? (
          <button
            type="button"
            onClick={onSwitchRegister}
            className="font-semibold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            Sign up
          </button>
        ) : (
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        )}
      </p>
    </form>
  )
}

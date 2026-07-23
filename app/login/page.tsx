'use client'

import { useEffect, useState, Suspense } from 'react'
import { LoginForm } from '@/components/login-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [rememberEmail, setRememberEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'fade'>('fade')

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 400)
  }

  const triggerExit = (url: string, direction: 'left' | 'right' | 'fade') => {
    setExitDirection(direction)
    setIsExiting(true)
    setTimeout(() => {
      router.push(url)
    }, 300)
  }

  // Load remembered email on mount, check for success message, and prefetch register page
  useEffect(() => {
    router.prefetch('/register')

    const saved = localStorage.getItem('marketHub_rememberEmail')
    if (saved) {
      setRememberEmail(saved)
    }

    const success = searchParams.get('success')
    if (success) {
      setSuccessMessage(success)
      // Clear message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 relative overflow-hidden">
      {/* Background Illustration - Subtle decorative element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Login Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={
              isShaking
                ? { x: [-10, 10, -10, 10, -5, 5, 0], opacity: 1, scale: 1, y: 0 }
                : isExiting
                ? exitDirection === 'left'
                  ? { x: -30, opacity: 0, scale: 0.97 }
                  : exitDirection === 'right'
                  ? { x: 30, opacity: 0, scale: 0.97 }
                  : { opacity: 0, scale: 0.97 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              x: isShaking ? { duration: 0.4 } : undefined
            }}
            className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-8 hover:shadow-2xl hover:border-accent/20"
          >
            {/* Logo Section */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">M</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">MarketHub</h1>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <LoginForm 
              onError={triggerShake} 
              onSuccess={(url) => triggerExit(url, 'fade')} 
              onSwitchRegister={() => triggerExit('/register', 'left')} 
            />

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p>
                By signing in, you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RegistrationForm } from '@/components/registration-form'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function RegisterCard() {
  const router = useRouter()
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

  // Prefetch login page on mount
  useEffect(() => {
    router.prefetch('/login')
  }, [router])

  return (
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
        <Link href="/" className="inline-flex items-center justify-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">MarketHub</h1>
        </Link>
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Create Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Join MarketHub and start exploring thousands of products
        </p>
      </div>

      {/* Registration Form */}
      <RegistrationForm 
        onError={triggerShake}
        onSuccess={(url) => triggerExit(url, 'fade')}
        onSwitchLogin={() => triggerExit('/login', 'right')}
      />

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground space-y-2">
        <p>
          By creating an account, you agree to our{' '}
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
  )
}

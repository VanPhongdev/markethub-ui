import { Metadata } from 'next'
import Link from 'next/link'
import { RegistrationForm } from '@/components/registration-form'

export const metadata: Metadata = {
  title: 'Create Account | MarketHub',
  description: 'Sign up for MarketHub and start shopping today.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-8">
          {/* Logo and Heading */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block text-2xl font-bold text-accent hover:text-accent/80 transition-colors">
              MarketHub
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
              <p className="text-sm text-muted-foreground">
                Join MarketHub and start exploring thousands of products
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <RegistrationForm />

          {/* Footer Links */}
          <div className="text-center space-y-3 text-xs text-muted-foreground">
            <div className="flex gap-2 justify-center">
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

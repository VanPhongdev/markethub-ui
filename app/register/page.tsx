import { Metadata } from 'next'
import { RegisterCard } from '@/components/register-card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Account | MarketHub',
  description: 'Sign up for MarketHub and start shopping today.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 relative overflow-hidden">
      {/* Background Illustration - Subtle decorative element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Register Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <RegisterCard />

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

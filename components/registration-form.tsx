'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react'
import { calculatePasswordStrength, checkPassword } from '@/lib/password-strength'
import Link from 'next/link'

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  birthday?: string
  terms?: string
  submit?: string
}

export function RegistrationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthday: '',
    termsAccepted: false,
  })

  const passwordStrength = calculatePasswordStrength(formData.password)
  const passwordChecks = checkPassword(formData.password)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateAge = (dateString: string): boolean => {
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age >= 13
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (passwordStrength.level === 'weak') {
      newErrors.password = 'Password does not meet complexity requirements'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.birthday && !validateAge(formData.birthday)) {
      newErrors.birthday = 'You must be at least 13 years old'
    }

    if (!formData.termsAccepted) {
      newErrors.terms = 'You must accept the Terms of Service'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.fullName,
          gender: formData.gender || undefined,
          birthday: formData.birthday || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitError(data.error || 'Registration failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Redirect to login with success message
      router.push('/login?success=Registration successful. Please sign in to continue.')
    } catch (error) {
      setSubmitError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Full Name
        </label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          disabled={isLoading}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passwordStrength.level === 'weak'
                      ? 'bg-destructive w-1/3'
                      : passwordStrength.level === 'medium'
                      ? 'bg-yellow-500 w-2/3'
                      : 'bg-green-500 w-full'
                  }`}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {passwordStrength.level}
              </span>
            </div>

            {/* Password Checklist */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                {passwordChecks.minLength ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-destructive" />
                )}
                <span className={passwordChecks.minLength ? 'text-muted-foreground' : 'text-destructive'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordChecks.hasUppercase ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-destructive" />
                )}
                <span className={passwordChecks.hasUppercase ? 'text-muted-foreground' : 'text-destructive'}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordChecks.hasLowercase ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-destructive" />
                )}
                <span className={passwordChecks.hasLowercase ? 'text-muted-foreground' : 'text-destructive'}>
                  One lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordChecks.hasNumber ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-destructive" />
                )}
                <span className={passwordChecks.hasNumber ? 'text-muted-foreground' : 'text-destructive'}>
                  One number
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordChecks.hasSpecialChar ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-destructive" />
                )}
                <span className={passwordChecks.hasSpecialChar ? 'text-muted-foreground' : 'text-destructive'}>
                  One special character (!@#$%^&*)
                </span>
              </div>
            </div>
          </div>
        )}

        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Gender (Optional) */}
      <div className="space-y-2">
        <label htmlFor="gender" className="text-sm font-medium text-foreground">
          Gender (Optional)
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Birthday (Optional) */}
      <div className="space-y-2">
        <label htmlFor="birthday" className="text-sm font-medium text-foreground">
          Birthday (Optional)
        </label>
        <Input
          id="birthday"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          disabled={isLoading}
          className={errors.birthday ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">Must be 13+ years old</p>
        {errors.birthday && (
          <p className="text-sm text-destructive">{errors.birthday}</p>
        )}
      </div>

      {/* Terms & Privacy */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
            }
            disabled={isLoading}
            className={errors.terms ? 'border-destructive' : ''}
          />
          <label htmlFor="terms" className="text-sm text-foreground leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-destructive">{errors.terms}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      {/* Sign In Link */}
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}

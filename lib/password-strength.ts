export interface PasswordChecks {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

export interface PasswordStrength {
  score: number // 0-5
  level: 'weak' | 'medium' | 'strong'
  checks: PasswordChecks
  percentage: number // 0-100
}

export const checkPassword = (password: string): PasswordChecks => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      level: 'weak',
      checks: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      },
      percentage: 0,
    }
  }

  const checks = checkPassword(password)
  const passedChecks = Object.values(checks).filter(Boolean).length

  let level: 'weak' | 'medium' | 'strong' = 'weak'
  if (passedChecks >= 4) {
    level = 'strong'
  } else if (passedChecks >= 3) {
    level = 'medium'
  }

  const percentage = (passedChecks / 5) * 100

  return {
    score: passedChecks,
    level,
    checks,
    percentage,
  }
}

export const getPasswordStrengthColor = (level: 'weak' | 'medium' | 'strong'): string => {
  switch (level) {
    case 'weak':
      return 'bg-destructive'
    case 'medium':
      return 'bg-yellow-500'
    case 'strong':
      return 'bg-green-500'
  }
}

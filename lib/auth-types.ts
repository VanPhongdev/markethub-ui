// Auth Types and Mock Users

export interface User {
  id: string
  email: string
  fullName: string
  password?: string // Keep password optional in responses, used for mock credentials validation
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  birthday?: string
  status: 'ACTIVE' | 'BLOCKED'
  isEmailVerified: boolean
  roles?: string[]
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  message?: string
  user?: Omit<User, 'password'>
  accessToken?: string
  refreshToken?: string
  error?: string
}

export interface GoogleAuthResponse {
  success: boolean
  message?: string
  user?: Omit<User, 'password'>
  accessToken?: string
  refreshToken?: string
  error?: string
}

// Mock Users for demo purposes
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    fullName: 'Demo User',
    password: 'password123',
    gender: 'MALE',
    isEmailVerified: true,
    status: 'ACTIVE',
    roles: ['CUSTOMER'],
  },
  {
    id: 'user-2',
    email: 'unverified@example.com',
    fullName: 'Unverified User',
    password: 'password123',
    gender: 'FEMALE',
    isEmailVerified: false,
    status: 'ACTIVE',
    roles: ['CUSTOMER'],
  },
  {
    id: 'user-3',
    email: 'blocked@example.com',
    fullName: 'Blocked User',
    password: 'password123',
    gender: 'OTHER',
    isEmailVerified: true,
    status: 'BLOCKED',
    roles: ['CUSTOMER'],
  },
]

export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export function validateCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email)
  if (!user) return null
  if (user.password !== password) return null
  return user
}

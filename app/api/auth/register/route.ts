import { NextRequest, NextResponse } from 'next/server'
import { mockUsers, User } from '@/lib/auth-types'

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword, name, gender, birthday } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Xác nhận mật khẩu không khớp' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = mockUsers.find(user => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Validate password complexity
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar && password.length >= 8)) {
      return NextResponse.json(
        { error: 'Password does not meet complexity requirements' },
        { status: 400 }
      )
    }

    // Validate age if birthday provided
    if (birthday) {
      const birthDate = new Date(birthday)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 13) {
        return NextResponse.json(
          { error: 'You must be at least 13 years old to register' },
          { status: 400 }
        )
      }
    }

    // Create new user (in mock, we'd normally save to DB)
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName: name,
      password,
      gender: (gender as 'MALE' | 'FEMALE' | 'OTHER') || undefined,
      birthday: birthday || undefined,
      isEmailVerified: false,
      status: 'ACTIVE' as const,
      roles: ['CUSTOMER'],
    }

    // Add to mock users (in production, save to DB)
    mockUsers.push(newUser)

    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra hòm thư để nhận mã xác thực OTP.',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

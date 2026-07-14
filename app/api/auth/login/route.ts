import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials } from '@/lib/auth-types'

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find and validate user
    const user = validateCredentials(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: 'Please verify your email before signing in',
          requiresEmailVerification: true,
        },
        { status: 403 }
      )
    }

    // Check if account is blocked
    if (user.status === 'BLOCKED') {
      return NextResponse.json(
        {
          error:
            'Your account has been suspended. Please contact support for assistance.',
        },
        { status: 403 }
      )
    }

    // Create response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        accessToken: 'mock-access-token-jwt',
        refreshToken: 'mock-refresh-token-jwt',
      },
      { status: 200 }
    )

    // Set authentication cookie (in real app, use proper session management)
    response.cookies.set('auth_token', JSON.stringify(userWithoutPassword), {
      httpOnly: false, // For demo purposes - in production, use httpOnly: true
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : undefined, // 7 days if remember me
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

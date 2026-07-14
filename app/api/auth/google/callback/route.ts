import { NextRequest, NextResponse } from 'next/server'

/**
 * Google OAuth Callback Route
 * This handles the redirect from Google after user authorization
 * In a real app, exchange the authorization code for tokens and create/update user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle authorization errors
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${error}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=missing_code', request.url)
      )
    }

    // In a real app:
    // 1. Exchange authorization code for access token
    // 2. Use access token to fetch user profile
    // 3. Create or update user in database
    // 4. Set session/authentication cookie
    
    // For demo purposes, simulate successful login
    const mockUser = {
      id: `google_${Date.now()}`,
      email: 'google.demo@example.com',
      fullName: 'Google Demo User',
      isEmailVerified: true,
      status: 'ACTIVE',
    }

    const response = NextResponse.redirect(
      new URL('/dashboard', request.url)
    )

    // Set authentication cookie
    response.cookies.set('auth_token', JSON.stringify(mockUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    )
  }
}

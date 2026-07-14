import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // In a real app, redirect to Google OAuth
    // For demo purposes, we'll return a mock response
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    
    const params = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo_client_id',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    }

    Object.entries(params).forEach(([key, value]) => {
      googleAuthUrl.searchParams.append(key, value)
    })

    return NextResponse.json(
      { authUrl: googleAuthUrl.toString() },
      { status: 200 }
    )
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

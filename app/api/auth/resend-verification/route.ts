import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/auth-types'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = findUserByEmail(email)

    if (!user) {
      // For security, don't reveal if email exists
      return NextResponse.json(
        { message: 'If this email exists, a verification email will be sent' },
        { status: 200 }
      )
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 200 }
      )
    }

    // In a real app, send verification email here
    console.log(`Sending verification email to ${email}`)

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

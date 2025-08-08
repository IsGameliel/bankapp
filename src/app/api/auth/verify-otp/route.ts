// /src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP or email.' },
        { status: 401 }
      );
    }

    // Expire the OTP once used
    await prisma.user.update({
      where: { email },
      data: { otp: null },
    });

    console.log('Verifying OTP for:', email, otp);

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // ✅ Set token in HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'OTP verified.',
      role: user.role
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('[OTP VERIFY ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

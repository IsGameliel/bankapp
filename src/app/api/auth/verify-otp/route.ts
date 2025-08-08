// /src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Optional: Expire the OTP once used
    await prisma.user.update({
      where: { email },
      data: { otp: null },
    });
    console.log('Verifying OTP for:', email, otp);

    return NextResponse.json({ success: true, message: 'OTP verified.', role: user.role});
  } catch (error) {
    console.error('[OTP VERIFY ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  } 
}

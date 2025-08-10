export const dynamic = 'force-dynamic'; // Opt out of Edge Runtime

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '@/lib/mailer'; // We'll create this next
import { generateOtp } from '@/lib/utils'; // Utility function to generate OTP

export async function POST(req: Request) {
  try {
  const { email, password } = await req.json();
  console.log('Login attempt:', { email, password });

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

  const user = await prisma.user.findUnique({ where: { email } });
  console.log('User from DB:', user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password check:', {
      providedPassword: password,
      storedHash: user.password,
      validPassword
    });
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate 6-digit OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpires },
    });

    // Send OTP to email
    await sendOtpEmail(user.email, otp);

    return NextResponse.json({ message: 'OTP sent', userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

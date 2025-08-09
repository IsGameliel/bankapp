import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const body = await req.json();
    const { name, profilePicture } = body;
    await prisma.user.update({
      where: { id: decoded.id },
      data: { name, profilePicture },
    });
    // Fetch the latest user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, email: true, accountNumber: true, accountType: true, profilePicture: true }
    });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[USER UPDATE ERROR]', error);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 400 });
  }
}

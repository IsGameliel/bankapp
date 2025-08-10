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
    const { amount } = await req.json();
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }
    const loan = await prisma.loan.create({
      data: {
        userId: decoded.id,
        amount,
        status: 'PENDING',
      },
    });
    return NextResponse.json({ success: true, loan });
  } catch (error: any) {
    console.error('[LOAN REQUEST ERROR]', error);
    return NextResponse.json({ success: false, message: error.message || 'Error requesting loan' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const loans = await prisma.loan.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, loans });
  } catch (error: any) {
    console.error('[LOAN FETCH ERROR]', error);
    return NextResponse.json({ success: false, message: error.message || 'Error fetching loans' }, { status: 500 });
  }
}

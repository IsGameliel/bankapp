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
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }
    // Create a pending deposit transaction, do NOT update balance
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type: 'DEPOSIT',
        status: 'PENDING',
        user: { connect: { id: decoded.id } },
        description: 'Deposit request',
      },
      select: { id: true, amount: true, type: true, status: true, createdAt: true }
    });
    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('[DEPOSIT ERROR]', error);
    return NextResponse.json({ success: false, message: 'Deposit failed' }, { status: 500 });
  }
}

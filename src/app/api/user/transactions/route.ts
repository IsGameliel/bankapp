import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const transactions = await prisma.transaction.findMany({
      where: { userId: decoded.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        description: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error('[TRANSACTION FETCH ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch transactions' }, { status: 500 });
  }
}

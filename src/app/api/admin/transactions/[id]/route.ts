import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

import { requireAdmin } from '@/lib/verifyAdmin';
// GET /api/admin/transactions/[id] - fetch transactions for a user (admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const txs = await prisma.transaction.findMany({
      where: { userId: params.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, transactions: txs });
  } catch (err: any) {
    console.error('GET /api/admin/transactions/[id]', err);
    return NextResponse.json({ success: false, message: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    // Optionally, check if user is admin
    // if (decoded.role !== 'ADMIN') {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    // }
    const { status } = await req.json();
    if (!['PENDING', 'SUCCESS', 'FAILED'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }
    // Update transaction status
    const updated = await prisma.transaction.update({
      where: { id: params.id },
      data: { status },
    });
    // If marking as SUCCESS and type is DEPOSIT, increment user balance
    if (updated.type === 'DEPOSIT' && status === 'SUCCESS') {
      await prisma.user.update({
        where: { id: updated.userId },
        data: { balance: { increment: updated.amount } },
      });
    }
    // If marking as SUCCESS and type is WITHDRAWAL, decrement user balance
    if (updated.type === 'WITHDRAWAL' && status === 'SUCCESS') {
      await prisma.user.update({
        where: { id: updated.userId },
        data: { balance: { decrement: updated.amount } },
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN TX PATCH ERROR]', error);
    return NextResponse.json({ success: false, message: 'Failed to update transaction' }, { status: 500 });
  }
}

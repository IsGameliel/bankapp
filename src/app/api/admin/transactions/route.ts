// /src/app/api/admin/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/verifyAdmin';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const transactions = await prisma.transaction.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json({ success: true, transactions });
  } catch (err: any) {
    console.error('GET /api/admin/transactions', err);
    return NextResponse.json({ success: false, message: err.message || 'Unauthorized' }, { status: 401 });
  }
}

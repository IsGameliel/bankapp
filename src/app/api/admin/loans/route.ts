// /src/app/api/admin/loans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/verifyAdmin';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const loans = await prisma.loan.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, loans });
  } catch (err: any) {
    console.error('GET /api/admin/loans', err);
    return NextResponse.json({ success: false, message: err.message || 'Unauthorized' }, { status: 401 });
  }
}

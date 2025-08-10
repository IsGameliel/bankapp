// /src/app/api/admin/loans/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/verifyAdmin';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const { status } = await req.json();
    let updated;
    if (status === 'APPROVED') {
      // First, approve the loan
      updated = await prisma.loan.update({
        where: { id: params.id },
        data: { status: 'APPROVED' },
        include: { user: true },
      });
      // Credit user's balance
      await prisma.user.update({
        where: { id: updated.userId },
        data: { balance: { increment: updated.amount } },
      });
      // Create transaction
      await prisma.transaction.create({
        data: {
          userId: updated.userId,
          amount: updated.amount,
          type: 'DEPOSIT',
          description: `Loan approved: ${updated.id}`,
          status: 'SUCCESS',
        },
      });
      // Set status to SUCCESS
      updated = await prisma.loan.update({
        where: { id: params.id },
        data: { status: 'PAID' },
        include: { user: true },
      });
    } else {
      // For other statuses (e.g., REJECTED), just update as requested
      updated = await prisma.loan.update({
        where: { id: params.id },
        data: { status },
        include: { user: true },
      });
    }
    return NextResponse.json({ success: true, loan: updated });
  } catch (err: any) {
    console.error('PATCH /api/admin/loans/[id]', err);
    return NextResponse.json({ success: false, message: err.message || 'Error updating loan' }, { status: 500 });
  }
}

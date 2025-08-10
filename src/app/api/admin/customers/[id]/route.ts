// /src/app/api/admin/customers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/verifyAdmin';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const id = params.id;
    const { status, accountType, balance, name, email } = await req.json();

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: status ?? undefined,
        accountType: accountType ?? undefined,
        balance: typeof balance === 'number' ? balance : undefined,
        name: name ?? undefined,
        email: email ?? undefined,
      },
      select: {
        id: true, name: true, email: true, status: true, accountType: true, balance: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error('PATCH /api/admin/customers/[id] error', err);
    return NextResponse.json({ success: false, message: err.message || 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const id = req.nextUrl.pathname.split('/').pop();

    // Optional: cascade delete related transactions & loans (be careful)
    await prisma.transaction.deleteMany({ where: { userId: id } });
    await prisma.loan.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/admin/customers/[id] error', err);
    return NextResponse.json({ success: false, message: err.message || 'Error deleting user' }, { status: 500 });
  }
}

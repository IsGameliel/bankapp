// /src/app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/verifyAdmin';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const users = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        status: true,
        accountType: true,
        accountNumber: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error('GET /api/admin/customers error', err);
    return NextResponse.json({ success: false, message: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { name, email, password, accountType, balance } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        balance: balance ?? 0,
        accountType,
        accountNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        status: true,
        accountType: true,
        accountNumber: true,
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/customers error', err);
    return NextResponse.json({ success: false, message: err.message || 'Error creating user' }, { status: 500 });
  }
}

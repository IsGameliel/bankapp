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

    const { amount, purpose, durationMonths, employmentStatus, monthlyIncome } = await req.json();

    // Validate inputs
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid loan amount' }, { status: 400 });
    }
    if (!durationMonths || typeof durationMonths !== 'number' || durationMonths <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid loan duration' }, { status: 400 });
    }
    if (!purpose || typeof purpose !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid loan purpose' }, { status: 400 });
    }
    if (!employmentStatus || typeof employmentStatus !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid employment status' }, { status: 400 });
    }
    if (!monthlyIncome || typeof monthlyIncome !== 'number' || monthlyIncome <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid monthly income' }, { status: 400 });
    }

    // Save loan
    const loan = await prisma.loan.create({
      data: {
        userId: decoded.id,
        amount,
        purpose,
        durationMonths,
        employmentStatus,
        monthlyIncome,
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

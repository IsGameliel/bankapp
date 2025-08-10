
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';


export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const { amount, recipientName, accountNumber, bank } = await req.json();
    if (!amount || !recipientName || !accountNumber || !bank) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount.' }, { status: 400 });
    }

    // Check user balance
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }
    if (user.balance < amount) {
      return NextResponse.json({ success: false, message: 'Insufficient balance.' }, { status: 400 });
    }

    // Create withdrawal transaction (pending admin approval)
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        type: 'WITHDRAWAL',
        description: `Withdrawal to ${recipientName} (${bank})\nAccount: ${accountNumber}`,
        status: 'PENDING',
      },
    });

    // Optionally, you could also create a WithdrawalRequest table/model for admin processing

    return NextResponse.json({ success: true, transaction });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

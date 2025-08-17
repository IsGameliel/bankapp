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

    const {
      amount,
      bankName,
      accountNumber,
      accountName,
      routingNumber,
      swiftCode,
      bankAddress,
      houseAddress,
      zipCode,
    } = await req.json();

    // validation
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid transfer data' },
        { status: 400 }
      );
    }

    // find sender
    const sender = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!sender) {
      return NextResponse.json({ success: false, message: 'Sender not found' }, { status: 404 });
    }

    // check balance
    if (sender.balance < amount) {
      return NextResponse.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
    }

    // transaction block
    const result = await prisma.$transaction(async (tx) => {
      // debit sender
      await tx.user.update({
        where: { id: sender.id },
        data: { balance: { decrement: amount } },
      });

      const metadata = {
        bankName,
        accountNumber,
        accountName,
        routingNumber,
        swiftCode,
        bankAddress,
        houseAddress,
        zipCode,
      };

      // log sender transaction
      const senderTx = await tx.transaction.create({
        data: {
          amount,
          type: 'TRANSFER',
          status: 'SUCCESS',
          userId: sender.id,
          description: `Transfer to external bank account (${accountName})`,
          metadata,
        },
      });

      return { senderTx };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[TRANSFER ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Transfer failed' },
      { status: 500 }
    );
  }
}

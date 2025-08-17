import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Total users
    const totalUsers = await prisma.user.count();

    // 2. Active loans (Approved but not Paid)
    const activeLoans = await prisma.loan.count({
      where: {
        status: {
          in: ['APPROVED'], // only active ones
        },
      },
    });

    // 3. Total transactions count
    const totalTransactions = await prisma.transaction.count({
      where: {
        status: 'SUCCESS',
      },
    });

    // 4. Total revenue (sum of all successful transactions)
    const totalRevenue = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'SUCCESS',
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeLoans,
        totalTransactions,
        totalRevenue: totalRevenue._sum.amount ?? 0,
      },
    });
  } catch (error) {
    console.error('[ADMIN_STATS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

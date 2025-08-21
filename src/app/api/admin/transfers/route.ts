import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      amount,
      bankName,
      accountNumber,
      accountName,
      routingNumber,
      swiftCode,
      bankAddress,
      houseAddress,
      zipCode,
      scheduledAt,
      status,
    } = body;

    if (!userId || !amount || !bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    // ✅ Get user and check balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.balance < numericAmount) {
      return NextResponse.json(
        { success: false, error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // ✅ Deduct money from user's balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { decrement: numericAmount },
      },
    });

    // ✅ Store metadata for transactions
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

    // ✅ Create transfer record
    const transfer = await prisma.transfer.create({
      data: {
        userId,
        amount: numericAmount,
        bankName,
        accountNumber,
        accountName,
        routingNumber,
        swiftCode,
        bankAddress,
        houseAddress,
        zipCode,
        status: status ?? "PENDING",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    // ✅ Create a transaction record for the USER (money debited)
    const userTransaction = await prisma.transaction.create({
      data: {
        userId,
        amount: numericAmount,
        type: "TRANSFER", // deducted from balance
        description: `You transferred $${numericAmount} to ${accountName} (${bankName} - ${accountNumber})`,
        status: status ?? "PENDING",
        metadata, // 👈 include bank details
      },
    });

    // ✅ Find Admin user (assuming role = "ADMIN")
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    let adminTransaction = null;
    if (admin) {
      // Admin sees it as a log/audit entry
      adminTransaction = await prisma.transaction.create({
        data: {
          userId: admin.id,
          amount: numericAmount,
          type: "TRANSFER",
          description: `User ${userId} transferred $${numericAmount} to ${accountName} (${bankName} - ${accountNumber})`,
          status: status ?? "PENDING",
          metadata, // 👈 include same metadata for admin view
        },
      });
    }

    return NextResponse.json({
      success: true,
      transfer,
      userTransaction,
      adminTransaction,
      updatedBalance: updatedUser.balance, // return updated balance
    });
  } catch (error) {
    console.error("❌ Transfer API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transfer" },
      { status: 500 }
    );
  }
}

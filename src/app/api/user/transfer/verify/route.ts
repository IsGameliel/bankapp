import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, transferId, otp } = await req.json();

    // Validate inputs
    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 401 });
    }
    if (!transferId || !otp) {
      return NextResponse.json(
        { success: false, message: "Missing transferId or otp" },
        { status: 400 }
      );
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Find pending transfer
    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: { user: { select: { id: true, balance: true } } },
    });

    if (!transfer) {
      return NextResponse.json({ success: false, message: "Transfer not found" }, { status: 404 });
    }

    if (transfer.user.id !== decoded.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid user" },
        { status: 403 }
      );
    }

    if (transfer.status !== "PENDING") {
      return NextResponse.json(
        { success: false, message: "Transfer already processed" },
        { status: 400 }
      );
    }

    // Verify OTP and expiry
    if (
      transfer.otp !== otp ||
      !transfer.otpExpires ||
      transfer.otpExpires < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Create transaction record and update transfer/balance atomically
    const [_, __, transaction] = await prisma.$transaction([
      // Deduct balance
      prisma.user.update({
        where: { id: decoded.id },
        data: { balance: { decrement: transfer.amount } },
      }),
      // Update transfer status
      prisma.transfer.update({
        where: { id: transferId },
        data: { status: "COMPLETED", otp: null, otpExpires: null },
      }),
      // Create transaction record
      prisma.transaction.create({
        data: {
          userId: decoded.id,
          amount: transfer.amount,
          type: "TRANSFER",
          description: `Transfer to ${transfer.accountName} (${transfer.accountNumber})`,
          status: "SUCCESS",
          metadata: {
            bankName: transfer.bankName,
            accountNumber: transfer.accountNumber,
            accountName: transfer.accountName,
            routingNumber: transfer.routingNumber || "",
            swiftCode: transfer.swiftCode || "",
            bankAddress: transfer.bankAddress || "",
            houseAddress: transfer.houseAddress || "",
            zipCode: transfer.zipCode || "",
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Transfer successful!",
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
        createdAt: transaction.createdAt,
        metadata: transaction.metadata,
      },
    });
  } catch (err) {
    console.error("Transfer Verify Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
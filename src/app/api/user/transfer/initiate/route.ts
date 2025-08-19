import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      token,
      amount,
      bankName,
      accountNumber,
      accountName,
      routingNumber,
      swiftCode,
      bankAddress,
      houseAddress,
      zipCode,
      pin,
    } = body;

    // Validate inputs
    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 401 });
    }
    if (!pin || !amount || !bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Check if user exists and has a transaction PIN
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, transactionPin: true, balance: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.transactionPin) {
      return NextResponse.json(
        { success: false, message: "Transaction PIN not set" },
        { status: 400 }
      );
    }

    // Verify PIN
    const isPinValid = await bcrypt.compare(pin, user.transactionPin);
    if (!isPinValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect PIN" },
        { status: 400 }
      );
    }

    // Check if user has sufficient balance
    if (!user.balance || user.balance < amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save pending transfer request
    const pendingTransfer = await prisma.transfer.create({
      data: {
        userId: user.id,
        amount,
        bankName,
        accountNumber,
        accountName,
        routingNumber,
        swiftCode,
        bankAddress,
        houseAddress,
        zipCode,
        status: "PENDING",
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Huntingtos Bank" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP for Transfer Verification",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <h2>Transfer Verification</h2>
        <p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "PIN verified. OTP sent to your email.",
      transferId: pendingTransfer.id,
    });
  } catch (err) {
    console.error("Transfer Initiate Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
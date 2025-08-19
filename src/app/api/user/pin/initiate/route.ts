import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { token, pin } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 401 });
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ success: false, message: "PIN must be 4 digits" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Fetch user to get their email
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { email: true },
    });

    if (!user || !user.email) {
      return NextResponse.json({ success: false, message: "User or email not found" }, { status: 404 });
    }

    // Hash PIN but don’t activate yet
    const hashedPin = await bcrypt.hash(pin, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with hashed PIN and OTP
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        transactionPin: hashedPin, // Temporarily store
        transferOtp: otp,
        transferOtpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"Huntingtos Bank" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP for Transaction PIN Setup",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <h2>Transaction PIN Setup</h2>
        <p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>
      `,
    });

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("PIN Initiate Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, pin, otp } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Missing token" }, { status: 401 });
    }

    if (!pin || !otp) {
      return NextResponse.json({ success: false, message: "Missing pin or otp" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Validate OTP
    if (
      user.transferOtp !== otp ||
      !user.transferOtpExpires ||
      user.transferOtpExpires < new Date()
    ) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    // PIN is already hashed and stored in /pin/initiate, so just clear OTP fields
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        transferOtp: null,
        transferOtpExpires: null,
      },
    });

    return NextResponse.json({ success: true, message: "Transaction PIN set successfully" });
  } catch (error) {
    console.error("PIN Verify Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
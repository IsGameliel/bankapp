// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  // Generate unique 10-digit account number
  async function generateUniqueAccountNumber() {
    let accountNumber;
    let exists = true;
    while (exists) {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      exists = !!(await prisma.user.findUnique({ where: { accountNumber } }));
    }
    return accountNumber;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const accountNumber = await generateUniqueAccountNumber();

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      accountNumber,
    },
  });

  return NextResponse.json({ message: 'User registered', userId: user.id });
}

// /src/lib/verifyAdmin.ts
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) throw new Error('No token');

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'ADMIN') throw new Error('Not admin');
    // return payload for further use (id, email, role)
    return payload as { id?: string; email?: string; role?: string; [k: string]: any };
  } catch (err) {
    throw new Error('Invalid token or not admin');
  }
}

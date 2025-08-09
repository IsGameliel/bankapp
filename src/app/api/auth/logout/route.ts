import { NextResponse } from 'next/server';

export async function POST() {
  // Remove the token cookie by setting it to empty and expired
  return NextResponse.json({ success: true }, {
    status: 200,
    headers: {
      'Set-Cookie': `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`
    }
  });
}

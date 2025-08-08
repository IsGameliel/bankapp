import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Encode your secret key for jose
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  console.log('Middleware token:', token);

  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to login, register, home
  if (pathname.startsWith('/auth') || pathname === '/') {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
      await jwtVerify(token, secret); // Verify token using jose
      return NextResponse.next();
    } catch (err) {
      console.error('[JWT ERROR]', err);
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

// This makes sure only dashboard routes are protected
export const config = {
  matcher: ['/dashboard/:path*'],
};

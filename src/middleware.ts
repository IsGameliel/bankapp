import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const middleware = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;
  console.log('Middleware token:', token);

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/auth') || pathname === '/') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (err) {
      console.error('[JWT ERROR]', err);
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/dashboard/:path*'],
};

import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, expectedToken } from './lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public: the login page, the login/logout endpoints, and the privacy policy.
  if (
    pathname === '/login' ||
    pathname === '/privacy' ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/logout')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token && token === expectedToken()) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

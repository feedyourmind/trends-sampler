import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, expectedToken, checkCredentials } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const user = String(form.get('user') ?? '');
  const pass = String(form.get('pass') ?? '');

  if (!checkCredentials(user, pass)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '?error=1';
    return NextResponse.redirect(url, { status: 303 });
  }

  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

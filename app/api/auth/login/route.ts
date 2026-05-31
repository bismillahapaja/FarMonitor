import { NextRequest, NextResponse } from 'next/server';
import { ADMIN } from '@/lib/data';
import { createSessionToken, getAuthCookieName } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body?.email ?? '');
  const password = String(body?.password ?? '');

  if (email !== ADMIN.email || password !== ADMIN.password) {
    return NextResponse.json({ message: 'Email atau kata sandi tidak cocok.' }, { status: 401 });
  }

  const token = createSessionToken({
    email: ADMIN.email,
    name: 'Farmonitor Admin',
    issuedAt: Date.now(),
  });

  const response = NextResponse.json({
    message: 'Login berhasil.',
    redirectTo: body?.redirectTo || '/dashboard',
  });

  response.cookies.set(getAuthCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

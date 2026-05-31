import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookieName } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set(getAuthCookieName(), '', { path: '/', expires: new Date(0) });
  return response;
}

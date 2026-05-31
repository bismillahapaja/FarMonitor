import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from './lib/auth';

const protectedPaths = ['/dashboard', '/recommendation', '/monitoring'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('farmonitor_session')?.value;
  const session = verifySessionToken(token);
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/recommendation/:path*', '/monitoring/:path*'],
};

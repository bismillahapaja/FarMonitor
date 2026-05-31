import { NextRequest, NextResponse } from 'next/server';
import { getActivePlantCookieName } from '@/lib/plant-session';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/recommendation', request.url));
  response.cookies.set(getActivePlantCookieName(), '', {
    path: '/',
    expires: new Date(0),
  });
  return response;
}

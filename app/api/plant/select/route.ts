import { NextRequest, NextResponse } from 'next/server';
import { PLANTS } from '@/lib/data';
import { getActivePlantCookieName } from '@/lib/plant-session';

async function readPlantKey(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}));
    return String(body?.plant_key ?? '').trim();
  }

  const form = await request.formData().catch(() => null);
  return String(form?.get('plant_key') ?? '').trim();
}

export async function POST(request: NextRequest) {
  const plantKey = await readPlantKey(request);

  if (!plantKey || !PLANTS[plantKey]) {
    return NextResponse.json({ status: 'error', message: 'Tanaman tidak valid.' }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL('/recommendation', request.url));
  response.cookies.set(getActivePlantCookieName(), plantKey, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

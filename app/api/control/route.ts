import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { controlDevice } from '@/lib/services';

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('farmonitor_session')?.value;
  return Boolean(verifySessionToken(token));
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const pin = String(body?.pin ?? '').trim();
  const value = body?.value;

  if (!pin) {
    return NextResponse.json({ status: 'error', message: 'Pin kontrol wajib diisi.' }, { status: 400 });
  }

  const result = await controlDevice(pin, value);
  return NextResponse.json(
    {
      status: result.success ? 'success' : 'error',
      message: result.message,
    },
    { status: result.success ? 200 : 422 },
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { syncSensorFromBlynk } from '@/lib/services';

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('farmonitor_session')?.value;
  return Boolean(verifySessionToken(token));
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }

  const result = await syncSensorFromBlynk();
  if (!result.success) {
    return NextResponse.json({ status: 'error', message: result.message }, { status: 422 });
  }
  return NextResponse.json({ status: 'success', message: result.message, data: result.data });
}

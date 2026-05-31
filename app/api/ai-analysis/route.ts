import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { getLatestSensor, analyzeWithAI } from '@/lib/services';

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('farmonitor_session')?.value;
  return Boolean(verifySessionToken(token));
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ result: 'Unauthorized' }, { status: 401 });
  }

  const sensor = await getLatestSensor();
  if (!sensor) {
    return NextResponse.json({ result: 'Belum ada data sensor.' }, { status: 404 });
  }

  try {
    const result = await analyzeWithAI(sensor);
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ result: 'Gagal mengambil analisis AI.' }, { status: 500 });
  }
}

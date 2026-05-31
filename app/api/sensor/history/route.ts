import { NextResponse } from 'next/server';
import { getSensorHistory } from '@/lib/services';

export async function GET() {
  const history = await getSensorHistory();
  return NextResponse.json(history);
}

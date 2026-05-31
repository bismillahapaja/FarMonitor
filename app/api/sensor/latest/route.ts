import { NextResponse } from 'next/server';
import { getLatestSensor } from '@/lib/services';

export async function GET() {
  const sensor = await getLatestSensor();
  if (!sensor) {
    return NextResponse.json({ message: 'Belum ada data sensor.' }, { status: 404 });
  }
  return NextResponse.json(sensor);
}

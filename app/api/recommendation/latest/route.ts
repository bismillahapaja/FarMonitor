import { NextResponse } from 'next/server';
import { latestSpreadsheetRecommendation } from '@/lib/services';

export async function GET() {
  const recommendation = await latestSpreadsheetRecommendation();
  if (!recommendation) {
    return NextResponse.json({
      rekomendasi_tanaman: '-',
      status_servo: '-',
      target_ph: '-',
      catatan: null,
    }, { status: 404 });
  }
  return NextResponse.json(recommendation);
}

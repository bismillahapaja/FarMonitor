import { ADMIN, PLANTS, SAMPLE_SENSOR, SAMPLE_SENSOR_HISTORY, SAMPLE_SPREADSHEET_RECOMMENDATION } from './data';
import type { RecommendationItem, RecommendationResult, SensorData, SpreadsheetRecommendation, WaterStatus } from './types';

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function bool(value: unknown): boolean | null {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'on', 'yes', 'aktif', 'open'].includes(normalized)) return true;
  if (['0', 'false', 'off', 'no', 'nonaktif', 'closed'].includes(normalized)) return false;
  return null;
}

async function safeFetchJson(url: string) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function normalizeSpreadsheetRow(row: Record<string, unknown>): SpreadsheetRecommendation {
  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const normalized = key.toLowerCase().replace(/[\s-]+/g, '_');
    mapped[normalized] = typeof value === 'string' ? value.trim() : value;
  }

  return {
    rekomendasi_tanaman:
      (mapped.rekomendasi_tanaman ?? mapped.rekomendasi ?? mapped.keterangan ?? mapped.saran_tindakan ?? mapped.tanaman ?? mapped.plant ?? mapped.name ?? null) as string | null,
    status_servo: (mapped.status_servo ?? mapped.servo ?? mapped.servo_valve ?? mapped.saran_status_servo ?? mapped.status ?? null) as string | null,
    target_ph: (mapped.target_ph ?? mapped.targetph ?? mapped.ph_target ?? mapped.ph_target_tanaman ?? null) as string | number | null,
    catatan: (mapped.catatan ?? mapped.note ?? null) as string | null,
    timestamp: (mapped.timestamp ?? mapped.created_at ?? mapped.waktu ?? mapped.time ?? null) as string | null,
    raw: row,
  };
}

export async function latestSpreadsheetRecommendation(): Promise<SpreadsheetRecommendation | null> {
  const url = process.env.GOOGLE_SHEET_WEB_APP_URL;
  if (!url) return SAMPLE_SPREADSHEET_RECOMMENDATION;

  const payload = await safeFetchJson(url);
  if (!payload) return SAMPLE_SPREADSHEET_RECOMMENDATION;

  const source = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.rows)
      ? payload.rows
      : Array.isArray(payload.recommendations)
        ? payload.recommendations
        : Array.isArray(payload)
          ? payload
          : [payload];

  const latest = Array.isArray(source) ? source[source.length - 1] : source;
  if (!latest || typeof latest !== 'object') return SAMPLE_SPREADSHEET_RECOMMENDATION;
  return normalizeSpreadsheetRow(latest as Record<string, unknown>);
}

export async function getLatestSensor(): Promise<SensorData | null> {
  const token = process.env.BLYNK_TOKEN;
  if (!token) return SAMPLE_SENSOR;

  const pins = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16'];
  const entries = await Promise.all(
    pins.map(async (pin) => {
      try {
        const response = await fetch(`https://blynk.cloud/external/api/get?token=${encodeURIComponent(token)}&${pin}`, {
          cache: 'no-store',
        });
        if (!response.ok) return [pin, null] as const;
        const value = (await response.text()).trim();
        return [pin, value || null] as const;
      } catch {
        return [pin, null] as const;
      }
    }),
  );

  const map = Object.fromEntries(entries);
  const sensor: SensorData = {
    ph_air: num(map.V0),
    ph_tanah: num(map.V1),
    kelembaban_tanah: num(map.V2),
    suhu_udara: num(map.V3),
    kelembaban_udara: num(map.V4),
    intensitas_cahaya: num(map.V5),
    sensor_hujan: bool(map.V6),
    kondisi_air: (map.V7 ?? null) as string | null,
    status_filtrasi: bool(map.V8),
    pemanas_nikrom: bool(map.V9),
    tambah_garam: bool(map.V10),
    target_ph_tanaman: num(map.V11),
    status_aliran: bool(map.V12),
    servo_valve: num(map.V13),
    target_ph: num(map.V14),
    ph_stlh_air: num(map.V15),
    penyiraman_ulang: bool(map.V16),
  };

  return Object.values(sensor).some((value) => value !== null && value !== undefined) ? sensor : SAMPLE_SENSOR;
}

export async function getSensorHistory(): Promise<SensorData[]> {
  return SAMPLE_SENSOR_HISTORY;
}

export async function syncSensorFromBlynk(): Promise<{ success: boolean; data: SensorData | null; message: string }> {
  const data = await getLatestSensor();
  if (!data) {
    return { success: false, data: null, message: 'Data Blynk tidak dapat dibaca.' };
  }
  return { success: true, data, message: 'Data sensor berhasil disinkronkan.' };
}

function waterState(sensor: SensorData | null | undefined): WaterStatus {
  const condition = String(sensor?.kondisi_air ?? '').toLowerCase().trim();
  const ph = num(sensor?.ph_air) ?? num(sensor?.ph_tanah);
  const safeWords = ['aman', 'baik', 'jernih', 'layak', 'normal', 'siap'];

  if (!sensor) {
    return {
      status: 'belum_ada_data',
      label: 'Belum ada data',
      action: 'Menunggu pembacaan sensor',
      description: 'Sistem masih menunggu data terbaru dari Blynk.',
      badge: 'bg-slate-700 text-slate-200',
    };
  }

  if ((condition && safeWords.some((word) => condition.includes(word))) || (ph !== null && ph >= 5.5 && ph <= 7.5)) {
    return {
      status: 'aman',
      label: 'Aman',
      action: 'Air diteruskan ke lahan',
      description: 'Kondisi air masuk kategori aman sehingga dapat dialirkan ke lahan.',
      badge: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
    };
  }

  return {
    status: 'perlu_diproses',
    label: 'Perlu diproses',
    action: 'Air diproses terlebih dahulu',
    description: 'Sistem menahan aliran dan menjalankan pengolahan air sebelum diteruskan.',
    badge: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  };
}

export function evaluateWaterStatus(sensor: SensorData | null | undefined): WaterStatus {
  return waterState(sensor);
}

export function recommendPlants(sensor: SensorData | null | undefined, spreadsheetRecommendation?: SpreadsheetRecommendation | null): RecommendationResult {
  const sheetName = String(spreadsheetRecommendation?.rekomendasi_tanaman ?? '').toLowerCase().trim();
  const condition = waterState(sensor).status;

  const results: RecommendationItem[] = Object.values(PLANTS).map((plant) => {
    let score = 50;
    const reasons: string[] = [];

    const ph = num(sensor?.ph_tanah) ?? num(sensor?.ph_air);
    if (ph !== null) {
      const mid = (plant.ideal_ph_min + plant.ideal_ph_max) / 2;
      const gap = Math.abs(ph - mid);
      score += Math.max(0, 40 - gap * 12);
      reasons.push(`pH sensor berada di sekitar rentang ideal ${plant.ideal_ph_min}–${plant.ideal_ph_max}.`);
    }

    const temperature = num(sensor?.suhu_udara);
    if (temperature !== null) {
      score += temperature >= 20 && temperature <= 34 ? 8 : 0;
    }

    const humidity = num(sensor?.kelembaban_tanah);
    if (humidity !== null) {
      score += humidity >= 40 ? 6 : 0;
    }

    if (condition === 'aman') {
      score += ['tinggi', 'sedang'].includes(plant.water_need) ? 10 : 5;
      reasons.push('Kondisi air terdeteksi aman sehingga cocok untuk pemanfaatan lahan.');
    } else if (condition === 'perlu_diproses') {
      score -= 5;
      reasons.push('Kondisi air masih perlu diproses sebelum dialirkan ke lahan.');
    }

    if (sheetName && plant.name.toLowerCase().includes(sheetName)) {
      score += 20;
      reasons.push('Selaras dengan rekomendasi dari spreadsheet.');
    }

    return {
      key: plant.key,
      name: plant.name,
      description: plant.description,
      advantages: plant.advantages,
      ideal_ph: `${plant.ideal_ph_min} - ${plant.ideal_ph_max}`,
      ideal_environment: plant.ideal_environment,
      badge: plant.badge,
      water_need: plant.water_need,
      score: Math.round(score),
      reasons: Array.from(new Set(reasons)),
    };
  }).sort((a, b) => b.score - a.score);

  return {
    best: results[0] ?? null,
    items: results.slice(0, 4),
    water_state: condition === 'aman' ? 'aman' : condition === 'perlu_diproses' ? 'perlu_pemrosesan' : 'belum_terbaca',
    sheet: spreadsheetRecommendation ?? null,
    powered_by: 'Static',
  };
}

export async function analyzeWithAI(sensor: SensorData | null | undefined): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    return [
      'OpenRouter belum dikonfigurasi.',
      `pH air: ${sensor?.ph_air ?? 'N/A'}`,
      `pH tanah: ${sensor?.ph_tanah ?? 'N/A'}`,
      `Kelembaban tanah: ${sensor?.kelembaban_tanah ?? 'N/A'}`,
      `Suhu udara: ${sensor?.suhu_udara ?? 'N/A'}`,
      `Status air: ${sensor?.kondisi_air ?? 'N/A'}`,
      'Saran: aktifkan OpenRouter pada .env.local jika ingin analisis AI generatif.',
    ].join('\n');
  }

  const prompt = `Analisis kondisi sistem pertanian pintar berdasarkan data sensor berikut:\n\n${JSON.stringify(sensor ?? {}, null, 2)}\n\nBerikan ringkasan singkat, actionable, dan dalam Bahasa Indonesia.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'Farmonitor',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      return `Gagal mengambil analisis AI (status: ${response.status}).`;
    }

    const json = await response.json() as any;
    return json?.choices?.[0]?.message?.content || 'Tidak ada respons dari AI.';
  } catch (error) {
    return `Error AI: ${error instanceof Error ? error.message : 'unknown error'}`;
  }
}

export async function controlDevice(pin: string, value: string | number | boolean) {
  const token = process.env.BLYNK_TOKEN;
  if (!token) {
    return { success: true, message: 'Mode demo: perintah diterima, tetapi Blynk belum dikonfigurasi.' };
  }

  try {
    const response = await fetch(`https://blynk.cloud/external/api/update?token=${encodeURIComponent(token)}&${pin}=${encodeURIComponent(String(value))}`, {
      method: 'GET',
    });
    return { success: response.ok, message: response.ok ? 'Perintah berhasil dikirim ke Blynk.' : 'Gagal mengirim perintah ke Blynk.' };
  } catch {
    return { success: false, message: 'Gagal menghubungi Blynk.' };
  }
}

import Link from 'next/link';
import { formatDateTime, formatNumber, formatPercent } from '@/lib/utils';
import { SAMPLE_SENSOR, SAMPLE_SPREADSHEET_RECOMMENDATION, SITE, PLANTS } from '@/lib/data';
import { getLatestSensor, latestSpreadsheetRecommendation } from '@/lib/services';

export default async function HomePage() {
  const latestSensor = await getLatestSensor();
  const latestSheet = await latestSpreadsheetRecommendation();
  const sensor = latestSensor ?? SAMPLE_SENSOR;

  const stats = [
    { label: 'pH air', value: formatNumber(sensor.ph_air) },
    { label: 'pH tanah', value: formatNumber(sensor.ph_tanah) },
    { label: 'Kelembaban tanah', value: formatPercent(sensor.kelembaban_tanah) },
    { label: 'Suhu udara', value: `${formatNumber(sensor.suhu_udara)}°C` },
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur">
          <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            {SITE.tagline}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Dashboard pertanian cerdas untuk monitoring air, tanah, dan tanaman.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            FarMonitor Website: login, dashboard, rekomendasi tanaman,
            monitoring sensor, kontrol perangkat, dan analisis AI opsional.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              Masuk ke dashboard
            </Link>
            <Link href="/recommendation" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
              Lihat rekomendasi
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Rekomendasi spreadsheet</p>
            <h2 className="mt-2 text-2xl font-bold text-white">{latestSheet?.rekomendasi_tanaman ?? SAMPLE_SPREADSHEET_RECOMMENDATION.rekomendasi_tanaman}</h2>
            <p className="mt-2 text-sm text-slate-300">Target pH: {String(latestSheet?.target_ph ?? SAMPLE_SPREADSHEET_RECOMMENDATION.target_ph ?? '-')}</p>
            <p className="mt-2 text-sm text-slate-300">Catatan: {latestSheet?.catatan ?? SAMPLE_SPREADSHEET_RECOMMENDATION.catatan ?? '-'}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Terakhir diperbarui</p>
            <p className="mt-2 text-sm text-slate-300">{formatDateTime(latestSheet?.timestamp ?? SAMPLE_SPREADSHEET_RECOMMENDATION.timestamp)}</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Tanaman yang tersedia</p>
            <div className="mt-4 grid gap-3">
              {Object.values(PLANTS).map((plant) => (
                <div key={plant.key} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{plant.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{plant.badge}</p>
                    </div>
                    <span className="text-sm text-slate-300">pH {plant.ideal_ph_min}–{plant.ideal_ph_max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

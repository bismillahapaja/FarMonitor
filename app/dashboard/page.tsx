import Link from 'next/link';
import { redirect } from 'next/navigation';
import SmartPanels from '@/components/SmartPanels';
import { getSession } from '@/lib/auth';
import { getLatestSensor, latestSpreadsheetRecommendation, recommendPlants, evaluateWaterStatus } from '@/lib/services';
import { SAMPLE_SENSOR, PLANTS } from '@/lib/data';
import { getActivePlantKey } from '@/lib/plant-session';

export default async function DashboardPage() {
  const session = getSession();
  if (!session) redirect('/login');

  const sensor = (await getLatestSensor()) ?? SAMPLE_SENSOR;
  const spreadsheetRecommendation = await latestSpreadsheetRecommendation();
  const analysis = recommendPlants(sensor, spreadsheetRecommendation);
  const waterStatus = evaluateWaterStatus(sensor);
  const activePlantKey = getActivePlantKey();
  const activePlantName = activePlantKey ? PLANTS[activePlantKey]?.name ?? null : null;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Dashboard utama</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Ringkasan kondisi lahan dan sistem IoT</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Dashboard ini memusatkan ringkasan sensor, rekomendasi tanaman, logika air, dan tombol kontrol perangkat.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/recommendation" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
            Rekomendasi
          </Link>
          <Link href="/monitoring" className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Monitoring
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['pH air', sensor.ph_air?.toFixed(1) ?? '-'],
          ['pH tanah', sensor.ph_tanah?.toFixed(1) ?? '-'],
          ['Kelembaban tanah', sensor.kelembaban_tanah == null ? '-' : `${Math.round(sensor.kelembaban_tanah)}%`],
          ['Suhu udara', sensor.suhu_udara == null ? '-' : `${sensor.suhu_udara.toFixed(1)}°C`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 ring-1 ring-white/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Rekomendasi otomatis</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{analysis.best?.name ?? 'Belum ada rekomendasi'}</h2>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Skor {analysis.best?.score ?? 0}</span>
          </div>

          <p className="mt-4 text-slate-300">{analysis.best?.description ?? 'Sistem belum membaca data yang cukup untuk memberikan rekomendasi.'}</p>

          {analysis.best?.reasons?.length ? (
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Alasan utama</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {analysis.best.reasons.map((reason) => (
                  <li key={reason} className="flex gap-2"><span className="text-emerald-400">•</span><span>{reason}</span></li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Spreadsheet</p>
              <p className="mt-2 text-sm text-slate-300">{spreadsheetRecommendation?.rekomendasi_tanaman ?? '-'}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tanaman aktif</p>
              <p className="mt-2 text-sm text-slate-300">{activePlantName ?? 'Belum dipilih'}</p>
            </div>
          </div>
        </article>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Status air</p>
            <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${waterStatus.badge}`}>{waterStatus.label}</span>
            <p className="mt-3 text-sm leading-7 text-slate-300">{waterStatus.description}</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Kandidat tanaman</p>
            <div className="mt-4 grid gap-3">
              {analysis.items.map((item) => (
                <div key={item.key} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.badge}</p>
                    </div>
                    <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white">
                      {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SmartPanels
        sensor={sensor}
        waterStatus={waterStatus}
        recommendedPlants={analysis.items}
        activePlantKey={activePlantKey}
        activePlantName={activePlantName}
      />
    </section>
  );
}

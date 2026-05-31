import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getLatestSensor, latestSpreadsheetRecommendation, recommendPlants, evaluateWaterStatus } from '@/lib/services';
import { SAMPLE_SENSOR, PLANTS } from '@/lib/data';
import { getActivePlantKey } from '@/lib/plant-session';

export default async function RecommendationPage() {
  const session = getSession();
  if (!session) redirect('/login');

  const sensor = (await getLatestSensor()) ?? SAMPLE_SENSOR;
  const sheet = await latestSpreadsheetRecommendation();
  const analysis = recommendPlants(sensor, sheet);
  const waterStatus = evaluateWaterStatus(sensor);
  const activePlantKey = getActivePlantKey();
  const activePlantName = activePlantKey ? PLANTS[activePlantKey]?.name ?? null : null;

  return (
    <section id="top" className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Pemilihan tanaman</p>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">AI Ready</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-white">Pilih tanaman yang paling cocok untuk lahan saat ini</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Sistem menganalisis kondisi lahan, kualitas air, dan data sensor untuk memberikan rekomendasi tanaman yang paling akurat.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
            Kembali ke dashboard
          </Link>
          <Link href="/monitoring" className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Ke monitoring
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Saran spreadsheet</p>
          <p className="mt-3 text-2xl font-bold text-white">{sheet?.rekomendasi_tanaman ?? '-'}</p>
          <p className="mt-2 text-sm text-slate-300">Target pH: {String(sheet?.target_ph ?? '-')}</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Tanaman aktif</p>
          <p className="mt-3 text-2xl font-bold text-white">{activePlantName ?? 'Belum dipilih'}</p>
          <p className="mt-2 text-sm text-slate-300">User bisa mengganti pilihan kapan saja.</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Status air</p>
          <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${waterStatus.badge}`}>{waterStatus.label}</span>
          <p className="mt-2 text-sm text-slate-300">{waterStatus.action}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {analysis.items.map((plant) => {
          const isActive = activePlantKey === plant.key;
          return (
            <article
              key={plant.key}
              className={`rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 ring-1 ring-white/5 ${isActive ? 'ring-2 ring-emerald-500/40' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">{plant.badge}</span>
                  <h2 className="mt-4 text-2xl font-bold text-white">{plant.name}</h2>
                  <p className="mt-2 text-sm text-slate-400">pH ideal: {plant.ideal_ph}</p>
                </div>
                <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white">Skor {plant.score}</span>
              </div>

              <p className="mt-4 leading-7 text-slate-300">{plant.description}</p>

              {plant.reasons.length ? (
                <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">Alasan sistem merekomendasikan</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {plant.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2"><span className="text-emerald-400">•</span><span>{reason}</span></li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Keunggulan</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {plant.advantages.map((advantage) => (
                    <span key={advantage} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                      {advantage}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <form action="/api/plant/select" method="post">
                  <input type="hidden" name="plant_key" value={plant.key} />
                  <button className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                    Pilih tanaman ini
                  </button>
                </form>
                <Link href="/monitoring" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
                  Lihat monitoring
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">Tindakan cepat</p>
            {activePlantKey ? (
              <h2 className="mt-1 text-2xl font-bold text-white">Jika pilihan sebelumnya kurang tepat, reset tanaman aktif</h2>
            ) : (
              <h2 className="mt-1 text-2xl font-bold text-white">Mulai dengan memilih salah satu tanaman di atas</h2>
            )}
          </div>
          {activePlantKey ? (
            <form action="/api/plant/change" method="post">
              <button className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20">
                Ganti tanaman
              </button>
            </form>
          ) : (
            <div className="flex gap-3">
              <Link href="#top" className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                Pilih tanaman
              </Link>
              <Link href="/monitoring" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
                Lihat monitoring
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

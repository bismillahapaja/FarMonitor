import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getLatestSensor, latestSpreadsheetRecommendation, recommendPlants, evaluateWaterStatus } from '@/lib/services';
import { SAMPLE_SENSOR } from '@/lib/data';
import SmartPanels from '@/components/SmartPanels';
import { getActivePlantKey } from '@/lib/plant-session';
import { PLANTS } from '@/lib/data';

export default async function MonitoringPage() {
  const session = getSession();
  if (!session) redirect('/login');

  const sensor = (await getLatestSensor()) ?? SAMPLE_SENSOR;
  const sheet = await latestSpreadsheetRecommendation();
  const analysis = recommendPlants(sensor, sheet);
  const waterStatus = evaluateWaterStatus(sensor);
  const activePlantKey = getActivePlantKey();
  const activePlantName = activePlantKey ? PLANTS[activePlantKey]?.name ?? null : null;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Monitoring tanaman aktif</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Pantau tanaman pilihan dan kondisi air secara bersamaan</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Halaman ini menunjukkan tanaman yang sudah dipilih user. Jika air aman, sistem meneruskan air ke lahan. Jika belum aman, air diproses terlebih dahulu.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/recommendation" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
            Ubah tanaman
          </Link>
          <Link href="/dashboard" className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            Ke dashboard
          </Link>
        </div>
      </div>

      <SmartPanels
        sensor={sensor}
        waterStatus={waterStatus}
        recommendedPlants={analysis.items}
        activePlantKey={activePlantKey}
        activePlantName={activePlantName}
      />

      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">Sumber data</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Sensor, spreadsheet, dan AI</h2>
            <p className="mt-2 text-sm text-slate-300">
              Next.js menggabungkan data sensor, rekomendasi spreadsheet, dan logika AI di satu dashboard ringan.
            </p>
          </div>
          <Link href="/recommendation" className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
            Lihat rekomendasi
          </Link>
        </div>
      </div>
    </section>
  );
}

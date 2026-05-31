'use client';

import { useState } from 'react';
import type { RecommendationItem, SensorData, WaterStatus } from '@/lib/types';
import { formatDateTime, formatNumber } from '@/lib/utils';

type Props = {
  sensor: SensorData | null;
  waterStatus: WaterStatus;
  recommendedPlants: RecommendationItem[];
  activePlantKey: string | null;
  activePlantName: string | null;
};

export default function SmartPanels({ sensor, waterStatus, recommendedPlants, activePlantKey, activePlantName }: Props) {
  const [aiResult, setAiResult] = useState('Belum ada analisis');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function handleControl(pin: string, value: string | number | boolean) {
    setMessage('Mengirim perintah...');
    try {
      const response = await fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, value }),
      });
      const data = await response.json();
      setMessage(data.message || (response.ok ? 'Perintah terkirim.' : 'Gagal mengirim perintah.'));
    } catch {
      setMessage('Gagal mengirim perintah.');
    }
  }

  async function runAI() {
    setBusy(true);
    setAiResult('⏳ Memproses analisis AI...');
    try {
      const response = await fetch('/api/ai-analysis', { method: 'POST' });
      const data = await response.json();
      setAiResult(data.result || 'Tidak ada hasil analisis');
    } catch (error) {
      setAiResult('❌ Gagal mengambil data AI.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Tanaman aktif</p>
          <h2 className="mt-3 text-2xl font-bold text-white">{activePlantName ?? 'Belum ada tanaman aktif'}</h2>
          <p className="mt-2 text-sm text-slate-300">Monitoring akan mengikuti tanaman yang dipilih user.</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Status air</p>
          <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${waterStatus.badge}`}>{waterStatus.label}</span>
          <p className="mt-3 text-sm leading-7 text-slate-300">{waterStatus.description}</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Aksi sistem</p>
          <p className="mt-3 text-2xl font-bold text-white">{waterStatus.action}</p>
          <p className="mt-2 text-sm text-slate-300">Aliran air mengikuti logika aman / proses berdasarkan status kualitas air.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 ring-1 ring-white/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Data sensor</p>
              <h2 className="text-2xl font-bold text-white">Pembacaan terbaru</h2>
            </div>
            <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">Live / latest</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="pH air" value={formatNumber(sensor?.ph_air)} />
            <Metric label="pH tanah" value={formatNumber(sensor?.ph_tanah)} />
            <Metric label="Kelembaban tanah" value={sensor?.kelembaban_tanah == null ? '-' : `${Math.round(sensor.kelembaban_tanah)}%`} />
            <Metric label="Suhu udara" value={sensor?.suhu_udara == null ? '-' : `${formatNumber(sensor.suhu_udara)}°C`} />
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">Logika air otomatis</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Ketika status air aman, sistem akan meneruskan air ke lahan. Jika belum aman, air akan diproses terlebih dahulu agar kondisi lahan tetap stabil.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={() => handleControl('V8', 1)} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              Filtrasi ON
            </button>
            <button onClick={() => handleControl('V8', 0)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
              Filtrasi OFF
            </button>
            <button onClick={() => handleControl('V12', 1)} className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
              Aliran ON
            </button>
            <button onClick={() => handleControl('V12', 0)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
              Aliran OFF
            </button>
            <button onClick={() => handleControl('V9', 1)} className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
              Pemanas ON
            </button>
            <button onClick={() => handleControl('V10', 1)} className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
              Tambah Garam
            </button>
          </div>
          {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Rekomendasi aktif</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{recommendedPlants[0]?.name ?? 'Belum tersedia'}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{recommendedPlants[0]?.description ?? 'Sistem belum membaca data cukup untuk rekomendasi saat ini.'}</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">AI Analysis</p>
            <button onClick={runAI} disabled={busy} className="mt-3 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60">
              {busy ? 'Memproses...' : 'Jalankan AI'}
            </button>
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">
              {aiResult}
            </pre>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Riwayat pembaruan</p>
            <p className="mt-2 text-sm text-slate-300">Terakhir sinkron: {formatDateTime(sensor?.updated_at || sensor?.created_at)}</p>
            <p className="mt-1 text-sm text-slate-300">Tanaman aktif: {activePlantKey ?? '-'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

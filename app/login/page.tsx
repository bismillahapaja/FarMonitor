'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login gagal.');
        return;
      }
      router.push(data.redirectTo || from);
      router.refresh();
    } catch {
      setError('Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Login session</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Masuk ke Farmonitor</h1>
          <p className="mt-4 text-slate-300">
            Gunakan akun default untuk mencoba dashboard hasil migrasi dari Laravel ke Next.js.
          </p>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <p className="font-semibold text-white">Akun untuk login</p>
            <p className="mt-2">Isi email & password dari environment <span className="font-mono">FARMONITOR_ADMIN_EMAIL</span> dan <span className="font-mono">FARMONITOR_ADMIN_PASSWORD</span>.</p>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="admin@farmonitor.test"
            />
          </label>

          <label className="mt-5 block text-sm font-medium text-slate-200">
            Password
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-500/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="••••••••"
            />
          </label>

          {error ? <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <button
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </section>
  );
}

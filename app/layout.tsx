import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/auth';
import { SITE } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Farmonitor',
  description: 'Monitoring pertanian cerdas berbasis Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const session = getSession();

  return (
    <html lang="id">
      <body>
        <div className="app-bg" />
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="Farmonitor" width={40} height={40} className="h-10 w-10 rounded-2xl object-contain" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Farmonitor</p>
                <p className="text-xs text-slate-400">Smart farming monitoring</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <Link href="/" className="transition hover:text-white">Beranda</Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="transition hover:text-white">Dashboard</Link>
                  <Link href="/recommendation" className="transition hover:text-white">Rekomendasi</Link>
                  <Link href="/monitoring" className="transition hover:text-white">Monitoring</Link>
                </>
              ) : (
                <Link href="/login" className="transition hover:text-white">Masuk</Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {session ? (
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-white">{session.name}</p>
                  <p className="text-xs text-slate-400">{session.email}</p>
                </div>
              ) : null}
              {session ? (
                <form action="/api/auth/logout" method="post">
                  <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10">
                    Keluar
                  </button>
                </form>
              ) : (
                <Link href="/login" className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>

        <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {SITE.name} • Sistem monitoring pertanian berbasis IoT
        </footer>
      </body>
    </html>
  );
}

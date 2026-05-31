# Farmonitor

Versi Next.js dari project Laravel Farmonitor Dashboard V2.

## Fitur
- Landing page publik
- Login session sederhana berbasis cookie
- Dashboard, rekomendasi tanaman, dan monitoring
- API route untuk sensor, kontrol, dan analisis AI
- Integrasi opsional ke Blynk, Google Spreadsheet, dan OpenRouter

## Menjalankan project
1. Install dependency:
   `npm install`
2. Salin `.env.example` menjadi `.env.local`
3. Jalankan dev server:
   `npm run dev`

## Catatan
- Jika variabel `BLYNK_TOKEN`, `GOOGLE_SHEET_WEB_APP_URL`, atau `OPENROUTER_API_KEY` kosong, aplikasi akan memakai data demo agar tetap bisa dipakai.
- Login admin:
  - Atur `FARMONITOR_ADMIN_EMAIL` dan `FARMONITOR_ADMIN_PASSWORD` melalui environment (mis. Netlify Environment Variables).
  - Nilai default sengaja dikosongkan untuk mencegah secret ter-commit ke repo.


## Struktur yang dipindahkan dari Laravel
- Route publik dan protected page
- Logika rekomendasi tanaman
- Monitoring sensor
- Kontrol perangkat IoT
- Analisis AI berbasis OpenRouter (opsional)

# Dashboard TM — panduan untuk agent

Laravel 13 + Inertia + React 19 (TypeScript). Dashboard laporan manajemen: Penjualan, Gudang, Produksi, Impor.

## Wajib dibaca sebelum mengubah UI
1. `DESIGN.md` — sumber kebenaran desain (token, glosarium, data contoh, aturan). Menang atas Stitch.
2. Skill `design-taste-frontend` (`.claude/skills/design-taste-frontend`), bagian app screens:
   `references/app-screens.md`. Style: `achromatic-ledger` (seed 2012543377) dengan override shell
   ke sidebar berlabel (DESIGN.md §5).

## Aturan kerja
- Warna hanya untuk data dan status. Satu hue data `--chart-3`. Tanpa gradient, glow, shadow pada kartu diam.
- Teks UI bahasa Indonesia + istilah teknis Inggris sesuai glosarium DESIGN.md §9. Format angka lewat `resources/js/lib/format.ts`.
- Data contoh di `resources/js/data/sample.ts`; setiap total dihitung dari baris dan diberi `console.assert`.
- Halaman/sub-menu baru: daftarkan di `config/dashboard.php` dan `resources/js/lib/nav.ts`; widget baru di `resources/js/widgets/registry.tsx`.
- Setiap blok punya state loading / kosong / error / terputus (`Card` di `components/UI.tsx`). Uji dengan `?sim=loading|error|empty|offline`.

## Cek sebelum selesai
```bash
npm run typecheck
npm run preview:build
node .claude/skills/design-taste-frontend/scripts/lint.mjs --app resources/js resources/css
node .claude/skills/design-taste-frontend/scripts/inspect.mjs --app http://localhost:8000/ringkasan
```
Perbaiki semua FAIL. WARN hanya boleh tersisa bila bisa dibela dalam satu kalimat.

## Laravel Boost
Pedoman Laravel Boost bawaan skeleton dipindah ke `docs/laravel-boost-setup.md`. Jalankan
`composer require laravel/boost --dev && php artisan boost:install` di mesin developer.

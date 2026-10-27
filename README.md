# Dashboard TM

Dashboard laporan manajemen real-time untuk **Penjualan, Gudang, Produksi, dan Impor**. Direksi dan
manajer divisi memakainya untuk kontrol dan pengambilan keputusan.

**Status: prototipe fase 1.** Ini *pure dashboard*: hanya baca, data contoh, dan real-time disimulasikan.
CRUD per divisi direncanakan untuk fase berikutnya (DESIGN.md §12).

Stack: Laravel 13 · Inertia 3 · React 19 · TypeScript · Vite. Desain: `DESIGN.md`.

## Menjalankan

```bash
composer install
cp .env.example .env && php artisan key:generate
npm install
composer run dev        # atau: php artisan serve  +  npm run dev
```

Buka http://localhost:8000. Halaman `/` diarahkan ke `/ringkasan`.

### Preview tanpa Laravel
```bash
npm run preview:build   # → preview/index.html (buka langsung di browser) + preview/artifact.html
```

## Halaman yang sudah dibangun

| Route | Isi |
|---|---|
| `/ringkasan` | KPI, Penjualan Oktober, Perlu perhatian, kuota, output per lini, kapal. Mode **Atur tampilan** (seret, ubah ukuran, hapus, Tambah widget, simpan per tampilan) dan tampilan tersimpan *Direksi* / *Manajer Impor*. |
| `/impor/jadwal-kapal` | Jalur kedatangan kapal (elemen khas) + detail kapal. |
| `/impor/kuota` | Pemakaian kuota per komoditas, proyeksi habis, riwayat PIB. |
| `/gudang/posisi-stok` | Daftar 1.284 SKU dengan cari, filter gudang/status, dan paging. |

Sub-menu lain sudah ada route-nya dan menampilkan state "belum dibangun". Bangun dengan prompt B2 di
`docs/PROMPTS.md`.

Di preview, halaman dipilih dengan hash sederhana, mis. `index.html#impor-kuota`.

**Uji state (aplikasi Laravel):** tambahkan `?sim=loading`, `?sim=error`, `?sim=empty`, atau `?sim=offline` ke URL.
**Tema gelap:** tombol bulan di kanan atas (tersimpan per browser).

## Struktur

```
app/Http/Controllers/DashboardController.php   route → halaman Inertia
app/Http/Middleware/HandleInertiaRequests.php  props bersama (nama app, pengguna, peran)
config/dashboard.php                           daftar modul & sub-menu → komponen
resources/css/app.css                          token & komponen (DESIGN.md §3, §8)
resources/js/
  app.tsx                 entry Inertia
  data/sample.ts          DATA CONTOH + assertion       ← ganti dengan data asli
  data/types.ts           bentuk data (kontrak props dari Laravel)
  lib/format.ts           format Rupiah, ton, %, tanggal Indonesia
  lib/store.ts            filter global, simulasi live, tema
  lib/nav.ts              struktur menu
  layouts/AppShell.tsx    sidebar, baris atas (cari, Live, tema, notifikasi)
  components/             Card + state, grafik SVG, ikon
  widgets/registry.tsx    katalog widget Ringkasan + tampilan default
  pages/                  halaman
  preview/                entry & shim untuk build preview statis
docs/                     PROMPTS.md (Stitch & agent), referensi Stitch
.claude/skills/design-taste-frontend   taste-skill (dipasang di repo)
```

## Mengganti data contoh

1. Buat service/query di Laravel per modul (penjualan harian, kuota, kapal, SKU, lini produksi).
2. Kirim sebagai props dari `DashboardController` dengan bentuk sesuai `resources/js/data/types.ts`.
3. Di halaman, ganti impor dari `@/data/sample` dengan props (`usePage().props` atau argumen komponen).
4. Real-time: ganti `startLive()` di `lib/store.ts` dengan Laravel Reverb/Echo atau polling
   `router.reload({ only: [...] })`. Jaga aturan DESIGN.md §8: nilai lama tetap tampil sampai yang baru tiba,
   layout tidak bergeser, dan status "Terputus" muncul saat koneksi hilang.
5. Filter periode (*Hari ini, 7 hari, Kuartal ini*) dan filter cabang aktif setelah data asli tersambung.

Daftar data contoh yang harus diganti: penjualan harian & target, area & pelanggan, output/rencana/downtime
per lini, kuota & realisasi per komoditas, 5 kapal, riwayat PIB, dokumen tertahan, nilai impor, 1.284 SKU
(dibangkitkan), nama pengguna "Rina Hartono".

## Skill desain

taste-skill sudah tersalin di `.claude/skills/design-taste-frontend`. Untuk memasang/memperbarui:
```bash
npx skills add https://github.com/Leonxlnx/taste-skill
```

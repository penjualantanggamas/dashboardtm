# DESIGN.md — Dashboard Manajemen

Design system untuk dashboard laporan manajemen: **Penjualan, Gudang, Produksi, Impor**.
File ini adalah satu sumber kebenaran untuk tiga pihak:

- **Google Stitch**: tempel isi file ini ke Design.md proyek Stitch.
- **Agent frontend** (Claude Code + taste-skill / `design-taste-frontend`): simpan di root repo.
- **Tim**: acuan saat review desain.

Gaya dasar diambil dari taste-skill, style **`achromatic-ledger`** (seed 2012543377). Shell-nya
diganti ke **sidebar berlabel** karena produk ini punya 4 modul dengan banyak sub-menu (alasan
lengkap di §4).

---

## 1. Produk dan pengguna

| Hal | Isi |
|---|---|
| Produk | Dashboard laporan real-time untuk kontrol dan pengambilan keputusan manajemen |
| Nama di UI | `{{NAMA_PERUSAHAAN}}` + "Dashboard". Ganti dengan nama dan logo asli. |
| Pengguna | **Direksi**: melihat semua modul. **Manajer divisi**: melihat semua modul. |
| Hak ubah data | Belum ada (fase 1 = *pure dashboard*). CRUD per divisi direncanakan (§12). |
| Personalisasi | Setiap pengguna boleh mengatur tata letak **Ringkasan** miliknya sendiri. |
| Pemakaian | Sesi panjang di desktop (1440px ke atas), dibuka berkali-kali sehari. Ponsel sebagai sekunder. |
| Data | Real-time. Setiap blok punya status kesegaran. |
| Bahasa | Indonesia untuk navigasi dan aksi, istilah teknis bahasa Inggris (§9). |

**Pertanyaan utama produk:** *"Apakah bisnis hari ini dan bulan ini sesuai rencana, dan apa yang perlu
saya putuskan?"*

---

## 2. Prinsip

1. **Warna hanya untuk data dan status, tidak untuk chrome.** Sidebar, header, tombol, dan kartu
   netral. Di bawah 1% piksel layar berwarna.
2. **Satu hue data.** Biru `#1d5fbf` hanya pada elemen data utama: periode berjalan, hari ini,
   realisasi. Pembanding dan sisanya abu-abu atau ink.
3. **Merah, kuning, hijau hanya berarti status.** Tidak pernah dipakai sebagai identitas modul.
4. **Warna perubahan berarti baik atau buruk, bukan naik atau turun.** Biaya, downtime, reject, dan
   keterlambatan yang naik berarti merah.
5. **Yang perlu keputusan selalu terlihat duluan.** Panel *Perlu perhatian* ada di layar pertama.
6. **Angka harus bisa dipercaya.** Total dihitung dari baris, setiap perbandingan menyebut
   pembandingnya, dan nol ditulis sebagai nol.
7. **Tenang untuk dilihat lama.** Tidak ada gradient, glow, glass, shadow pada elemen diam,
   emoji, atau animasi masuk.

---

## 3. Token

### 3.1 Light (default)

```css
:root {
  /* permukaan — "face": ground biru-abu dari dunia laporan/ledger */
  --ground:   #f2f4f7;   /* latar halaman + sidebar */
  --surface:  #ffffff;   /* kartu / widget */
  --raised:   #eeeeee;   /* well, tombol sekunder */
  --active:   #e4e7ec;   /* item nav aktif, baris terpilih */
  --border:   #e3e6ea;   /* tepi kartu (1.25:1 pada putih) */
  --rule:     #f0f0f0;   /* garis baris tabel */
  --control:  #d4d4d4;   /* border input / select */

  /* teks — semua ≥ 4.5:1 */
  --text:     #0a0a0a;
  --muted:    #5f6368;   /* label, meta (5.5:1 pada ground) */
  --faint:    #6b6b6b;   /* placeholder, tick sumbu */

  /* aksi */
  --primary:  #141414;   /* satu tombol utama per layar, label putih */
  --secondary-bg: #e5e5e5;

  /* data */
  --chart-1:  #141414;   /* seri ink */
  --chart-2:  #8a8a8a;   /* pembanding / target / periode lalu */
  --chart-3:  #1d5fbf;   /* HUE DATA: elemen data utama saja (6.1:1) */
  --grid:     #e5e5e5;

  /* status */
  --positive: #2e7d32;  --pill-positive-bg: #dcfae5;  --pill-positive-ink: #04250e;
  --negative: #c4242a;  --pill-negative-bg: #ffedea;  --pill-negative-ink: #831c1e;
  --warning:  #92400e;  --pill-warning-bg:  #fffbeb;  --pill-warning-ink:  #92400e;  /* border #fde68a */
  --pill-neutral-bg: #eeeeee;  --pill-neutral-ink: #3d3d3d;

  /* bentuk & ritme */
  --radius-card: 8px;  --radius-control: 6px;  --radius-chip: 4px;
  --gap: 12px;  --card-pad: 20px;  --pad: 24px;
  --sidebar-width: 240px;  --nav-row: 34px;
  --control-height: 36px;  --row-height: 44px;

  /* tipe */
  --font: "Geist", Inter, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;   /* ID & kode saja */
  --fs-title: 24px;  --fs-section: 16px;  --fs-kpi: 24px;  --fs-lead: 30px;
  --fs-body: 14px;   --fs-small: 12px;
}
```

### 3.2 Dark (opsional, untuk sesi malam)

```css
:root[data-theme="dark"] {
  --ground: #111111;  --surface: #191919;  --raised: #222222;  --active: #262626;
  --border: #2e2e2e;  --rule: #222222;     --control: #444444;
  --text: #f2f2f2;    --muted: #b4b4b4;    --faint: #949494;
  --primary: #ffffff;                       /* terbalik: isi putih, label hitam */
  --chart-1: #f2f2f2; --chart-2: #8a8a8a;  --chart-3: #5b8fe0;  --grid: #2b2b2b;
  --positive: #4fa36b; --negative: #ef6b6b; --warning: #e0a050;
}
```

Tema dark memakai abu netral, bukan navy atau slate. Pilihan tema disimpan per pengguna.

---

## 4. Tipografi

- **Geist** untuk semua teks; **Geist Mono** hanya untuk ID (No. PIB, No. PO, kode SKU).
- Bobot: 400, 500, 700. **700 hanya untuk nilai uang.**
- Skala: 12 / 14 / 16 / 24 / 30. Tidak ada teks di bawah 11px, tidak ada angka di atas 40px.
- `font-variant-numeric: tabular-nums` pada setiap angka di tabel, KPI, dan yang ter-update live.
- Sentence case di semua label. **Tidak ada label huruf kapital ber-tracking**, termasuk header tabel.

| Peran | Ukuran / bobot |
|---|---|
| Judul halaman (h1) | 24 / 600 |
| Judul kartu | 16 / 500 |
| Angka utama layar (satu saja) | 30 / 700 jika uang, 500 jika bukan |
| Nilai KPI | 24 / 500 (uang 700) |
| Body, sel tabel, nav | 14 / 400 |
| Label, meta, sumbu | 12 / 400 |

---

## 5. Shell

**Override dari style:** `achromatic-ledger` membagikan shell *tanpa sidebar*, dan redraw membagikan
*icon rail*. Keduanya tidak cocok karena produk ini punya 4 modul × 3–5 sub-menu yang harus terbaca
labelnya. Dipakai **open plane dengan sidebar berlabel** dari app-screens.md §3.1–3.2.

```
┌─────────────┬────────────────────────────────────────────────────┐
│ [Logo] Nama │  Breadcrumb / search ⌘K            ● Live 18:15 [av]│  ← tanpa top bar terpisah: baris
│             │                                                    │    ini adalah bagian atas canvas
│ Ringkasan   │  Ringkasan                    [Tampilan: Direksi ▾]│
│             │  2 kapal terlambat dan kuota …  [Atur]  [Export]   │
│ Penjualan ▾ │  ┌──── KPI strip (1 kartu, 4 sel) ───────────────┐ │
│  Laporan    │  └───────────────────────────────────────────────┘ │
│  Target vs… │  ┌── widget 8 kol ──────────┐ ┌─ Perlu perhatian ┐ │
│ Gudang ▸    │  │                          │ │                  │ │
│ Produksi ▸  │  └──────────────────────────┘ └──────────────────┘ │
│ Impor ▸     │                                                    │
│             │                                                    │
│ Pengaturan  │                                                    │
│ Bantuan     │                                                    │
│ [user row]  │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

**Sidebar (240px, di atas `--ground`, tanpa garis pemisah):**
- Atas: logo + nama perusahaan (monogram dalam ink, bukan kotak hitam berhuruf).
- Item 14/400, ikon outline 16px abu-abu, 1.5px stroke, baris 34px.
- **Aktif:** pill abu `--active`, radius 6, label tetap ink. Tidak ada bar warna di kiri, tidak ada
  isi warna brand.
- Modul bisa di-expand; sub-menu menjorok tanpa ikon. Hanya satu modul terbuka sekaligus
  (accordion), modul halaman aktif selalu terbuka.
- Badge angka **hanya** pada antrean yang perlu tindakan, dengan kata benda jelas
  (mis. "Perlu perhatian 6"). Tidak ada badge dekoratif.
- Bawah: Pengaturan, Bantuan, lalu baris pengguna (nama, peran: "Direksi" / "Manajer Gudang").
- **Tidak ada kartu upsell** (berbeda dari referensi, karena ini alat internal).
- Bisa diciutkan ke 56px (ikon + tooltip); posisi disimpan per pengguna.

**Baris atas canvas (48px):** breadcrumb di kiri, search ⌘K di tengah (≈ 480×32), di kanan
indikator Live, tombol tema, notifikasi, avatar. Tidak ada bar berwarna.

**Canvas:** padding 24px. Pada 1440px: 1440 − 240 − 2×24 = **1152px** lebar konten.

---

## 6. Grid

12 kolom, gap 12px, satu nilai gap horizontal dan vertikal.

```
kolom = (1152 − 11×12) / 12 = 85px
span 3  = 3×85 + 2×12  = 279   → 4×279 + 3×12 = 1152 ✓
span 4  = 4×85 + 3×12  = 376
span 6  = 6×85 + 5×12  = 570   → 2×570 + 12   = 1152 ✓
span 8  = 8×85 + 7×12  = 764   → 764 + 12 + 376 = 1152 ✓
span 12 = 1152
```

**Ukuran widget:** S = 3 kol · M = 4 kol · L = 6 kol · XL = 8 kol · Full = 12 kol.
Tinggi dalam unit 168px (1 unit) atau 348px (2 unit = 2×168 + 12).
Kartu dalam satu baris berakhir sejajar; tinggi kartu mengikuti isi, bukan diregangkan kosong.

---

## 7. Halaman Ringkasan (dashboard utama)

**Pertanyaan:** Apakah hari ini dan bulan ini sesuai rencana, dan apa yang perlu diputuskan?

**Baris judul**
- h1 "Ringkasan", di bawahnya **satu kalimat temuan** 14px abu, dihitung dari data:
  *"2 kapal terlambat dan kuota Resin PP tersisa 12,0% — keduanya perlu keputusan minggu ini."*
- Kanan, sejajar bawah dengan kalimat temuan: `Tampilan: Direksi ▾` (switcher) · `Atur tampilan`
  (sekunder) · `Export` (sekunder, menu PDF / Excel). **Tidak ada tombol primer di mode lihat.**
- Baris scope di bawahnya (36px): rentang tanggal (`1–26 Okt 2026`, preset *Hari ini, 7 hari,
  Bulan ini, Kuartal ini*), filter Cabang/Plant, filter Gudang. Filter global berlaku ke semua
  widget; widget yang punya periode sendiri menulisnya di header kartunya.

**Blok wajib (tidak bisa dihapus):**
1. **KPI strip**: satu kartu, dibagi garis 1px menjadi 4 sel (label 12 abu, nilai 24, caption 12
   menyebut pembanding). Bisa dipilih isinya, tidak bisa dihapus.
2. **Perlu perhatian**: span 4, di kanan widget utama. Maks 5 baris, lalu "Lihat semua (6)".

**Mode lihat vs mode atur**
- Mode lihat (default): tidak ada handle, tidak ada tombol hapus. Klik widget = drill-down ke
  sub-menu asalnya dengan filter yang sama terbawa.
- `Atur tampilan` → mode atur: baris judul diganti toolbar `Tambah widget` · `Reset ke default` ·
  `Batal` · **`Simpan`** (satu-satunya tombol primer). Setiap widget menampilkan handle seret
  (kiri atas), menu ukuran S/M/L/XL/Full, dan tombol hapus (×). Canvas memperlihatkan grid 12 kolom
  dengan garis putus-putus tipis.
- Keluar tanpa simpan meminta konfirmasi jika ada perubahan.

**Tampilan tersimpan:** default per peran (Direksi, Manajer Penjualan, Gudang, Produksi, Impor) +
tampilan buatan pengguna ("Rapat mingguan impor"). Switcher di baris judul.

---

## 8. Komponen

**Kartu / widget**: putih, border 1px `--border`, radius 8, padding 20, **tanpa shadow**. Header:
judul 16/500 kiri; kanan: periode sendiri (abu, jika ada), stempel kesegaran, menu ⋯ (Lihat detail,
Export widget, Ubah ukuran, Hapus dari Ringkasan). "Lihat detail" juga muncul sebagai link teks di
footer kartu daftar.

**KPI**: tanpa ikon, tanpa sparkline, tanpa kotak berwarna. Label di atas nilai. Delta 12–14px
dengan jendela waktu dalam kata ("vs Senin lalu"). Hanya angkanya yang diwarnai, sesuai baik/buruk.
Nol atau tanpa pembanding ditulis abu atau "–".

**Grafik**
- Satu pertanyaan, satu seri utama; pembanding dalam `--chart-2`.
- Garis 2px lurus, tanpa titik, tanpa area gradient (tint datar ≤ 14% bila perlu).
- 3–5 gridline horizontal `--grid`, tanpa garis sumbu Y, tick bulat di atas maksimum.
- Batang bersudut siku; batang periode berjalan dalam `--chart-3`, lainnya `--chart-1`/abu.
- Tidak ada legenda untuk satu seri. Ring tipis, maks 5 bagian, legenda sebagai tabel.
- Proyeksi setelah hari ini memakai garis putus-putus dengan nilai akhir dilabeli.
- **Kuota/target**: track sepanjang kuota, bagian terealisasi terisi, dalam perjalanan sebagai
  segmen lebih terang, kedua ujung dilabeli ("14.200 dari 18.000 t").

**Tabel**: header 12px abu sentence case, tanpa fill, tanpa zebra; baris 44px dengan garis
`--rule`; angka rata kanan tabular; ID dalam Geist Mono; satu status per baris; nilai kosong "–"
abu. Ringkasan maks 5 baris + "Lihat semua". Halaman daftar: total di atas, header sticky,
paging "1–50 dari 1.284".

**Status pill**: tinggi 20, teks 12/500, tint pucat + ink gelap hue yang sama.
`Tepat waktu` (positif) · `Terlambat` (negatif) · `Perhatian` (warning) · `Di laut` (netral).

**Tingkat alert**: *Kritis* (negatif, butuh keputusan) · *Perhatian* (warning) · *Info* (netral).
Satu tanda merah per objek, tidak lebih.

**Tombol**: tinggi 36 (toolbar 32), radius 6. Primer = isi `--primary` label putih, satu per layar.
Sekunder = `--secondary-bg`. Tersier = teks. Tidak ada tombol berwarna brand, tidak ada gradient.

**Panel Tambah widget**: sheet dari kanan, 480px, shadow (karena melayang). Search di atas, tab
modul `Semua · Penjualan · Gudang · Produksi · Impor`, lalu daftar widget: thumbnail grafik kecil
**digambar ink/abu** (bukan ikon dalam kotak berwarna), nama, deskripsi 1 baris, ukuran default,
tombol `Tambah` (sekunder). Widget yang sudah ada di Ringkasan bertanda "Sudah ditambahkan".

**Real-time**
- Indikator global di baris atas: titik 6px + "Live · diperbarui 18:15:42". Saat terputus:
  "Terputus · data terakhir 18:12" dengan tint warning, tanpa banner layar penuh.
- Nilai yang berubah: latar cell berkedip tint `--chart-3` 8% selama 1,2 detik, lalu hilang.
- Layout tidak pernah bergeser saat data masuk; panjang angka dicadangkan (tabular).
- Refresh tidak menghapus nilai lama; nilai lama tetap tampil sampai nilai baru tiba.

**State setiap blok**
- *Loading*: layout final dengan bar abu datar seukuran nilai, tanpa shimmer.
- *Kosong*: frame dan header tetap, satu kalimat ("Tidak ada kapal dijadwalkan tiba 7 hari ke depan.").
- *Error*: di dalam blok, satu kalimat + waktu data terakhir + "Coba lagi".
- *Nol*: ditulis "0", "Rp 0", "0,0%".

---

## 9. Bahasa dan format

**Glosarium (konsisten di seluruh UI):**

| Pakai | Bukan |
|---|---|
| Ringkasan | Home, Beranda |
| Penjualan · Gudang · Produksi · Impor | Sales, Warehouse, … (nama modul tetap Indonesia) |
| Dashboard, Export, Live, ETA, ETD, SKU, PO, PIB, OEE, Downtime, Reject | Padanan Indonesia yang dipaksakan |
| Tambah widget · Atur tampilan · Simpan · Batal · Lihat detail · Lihat semua | Add widget, Customize |
| Perlu perhatian | Alerts, Notifikasi penting |
| Target vs realisasi | Target vs actual |

**Format:**
- Rupiah: `Rp 1,84 M` (miliar), `Rp 845 jt`, `Rp 12.500` — koma desimal, titik ribuan.
- Kuantitas: `12.480 kg`, `412 t`, `1.284 SKU`. Satuan sebagai sufiks abu kecil.
- Persen: `95,3%`, satu desimal, konsisten per metrik.
- Tanggal: `26 Okt 2026`, rentang `1–26 Okt 2026`, jam `18:15 WIB`.
- Delta: tanda selalu ditulis (`+6,7%`, `−2,1%`) dan menyebut pembanding.

---

## 10. Data contoh (dipakai Stitch dan prototipe)

Satu set data, dipakai di semua layar supaya angka antar-layar sama. **Ganti dengan data asli.**
Waktu: Senin, 26 Okt 2026, 18:15 WIB.

**Penjualan**
- Hari ini Rp 1,84 M · target harian Rp 1,93 M → **95,3%** · Senin lalu Rp 1,71 M → **+7,6%**
- Bulan berjalan (1–26 Okt) Rp 41,2 M · target Okt Rp 52,0 M → 79,2% · 1–26 Sep Rp 38,6 M → +6,7%
- Hari kerja Senin–Sabtu: 27 hari di Okt 2026, target harian = 52,0 / 27 = Rp 1,93 M. Minggu (4, 11, 18, 25) = Rp 0.

**Produksi**
- Output hari ini 412 t · rencana 450 t → **91,6%**
- Lini 3 downtime 2 j 40 m hari ini

**Gudang**
- Nilai stok Rp 128,4 M · 1.284 SKU aktif · **7 SKU** di bawah stok minimum

**Impor — kuota 2026**

| Komoditas | Kuota | Terealisasi | Dalam perjalanan | Sisa | Sisa % |
|---|---:|---:|---:|---:|---:|
| Resin PP | 18.000 t | 14.200 t | 1.640 t | 2.160 t | 12,0% |
| Baja HRC | 24.000 t | 11.300 t | 2.900 t | 9.800 t | 40,8% |
| Kertas kraft | 9.000 t | 6.150 t | 1.200 t | 1.650 t | 18,3% |

**Impor — kapal dalam perjalanan (5, total 5.740 t, 2 terlambat)**

| Kapal | Komoditas | Muatan | Asal | ETA awal | Estimasi | Status |
|---|---|---:|---|---|---|---|
| MV Kirana Jaya | Resin PP | 900 t | Busan | 27 Okt | 27 Okt | Tepat waktu |
| MV Ocean Pearl | Baja HRC | 1.500 t | Shanghai | 24 Okt | 29 Okt | Terlambat 5 hari |
| MV Han Sung | Baja HRC | 1.400 t | Incheon | 31 Okt | 31 Okt | Tepat waktu |
| MV Nordic Bay | Kertas kraft | 1.200 t | Gothenburg | 2 Nov | 4 Nov | Terlambat 2 hari |
| MV Bintang Selatan | Resin PP | 740 t | Kaohsiung | 8 Nov | 8 Nov | Tepat waktu |

Pelabuhan tujuan: Tanjung Priok.

**Perlu perhatian (6; tampil 5)**
Teks dibuat pendek agar muat satu baris di kartu M (376px); detail ada di halaman tujuan.
1. Kritis — Kuota Resin PP tersisa 12,0% · Impor
2. Kritis — MV Ocean Pearl terlambat 5 hari · Impor
3. Perhatian — 7 SKU di bawah minimum · Gudang
4. Perhatian — Lini 3 downtime 2 j 40 m hari ini · Produksi
5. Perhatian — Penjualan hari ini 95,3% dari target · Penjualan
6. Perhatian — MV Nordic Bay terlambat 2 hari · Impor

**Produksi per lini (hari ini)** — Lini 1 (Ekstrusi) 124/130 t · Lini 2 (Pencetakan) 118/120 t ·
Lini 3 (Laminasi) 78/105 t, downtime 2 j 40 m · Lini 4 (Finishing) 92/95 t. Total 412/450 t.

**Proyeksi kuota Resin PP** — laju rata-rata 1.443 t/bulan (14.200 t ÷ 9,84 bulan); sisa 2.160 t
habis sekitar **11 Des 2026**.

Sumber kebenaran data contoh di kode: `resources/js/data/sample.ts` (dengan assertion).

---

## 11. Struktur menu dan katalog widget

| Modul | Sub-menu (halaman) | Widget yang disumbangkan ke Ringkasan |
|---|---|---|
| Penjualan | Laporan Penjualan · Outstanding Penjualan · Target vs Realisasi · Per Pelanggan/Area · Piutang | Penjualan harian vs target · Top 5 pelanggan · Penjualan per area · Umur piutang |
| Gudang | Posisi Stok · Mutasi Stok · Stok Kritis & Aging · Stock Opname | Stok kritis · Nilai stok per gudang · Aging stok · Selisih opname |
| Produksi | Rencana vs Realisasi · Efisiensi Lini (OEE) · Reject & QC · Pemakaian Bahan Baku | Output vs rencana · OEE per lini · Reject rate · Downtime hari ini |
| Impor | Laporan Impor · Kuota Impor · Jadwal Kedatangan Kapal · Status Dokumen | Sisa kuota per komoditas · Kapal 14 hari ke depan · Nilai impor bulan ini · Dokumen tertahan |

Sub-menu di atas adalah usulan awal; konfirmasi dengan manajemen sebelum fase build.
Setiap halaman sub-menu memiliki: h1 = nama sub-menu, breadcrumb `Modul / Sub-menu`, kalimat temuan,
filter scope, blok-blok laporan, tombol Export.

**Elemen khas produk:** *Jalur kedatangan kapal* — setiap kapal satu lajur pada sumbu tanggal;
garis ETD→estimasi tiba, tick berongga di ETA awal, titik ink di estimasi sekarang, segmen
keterlambatan dalam `--negative`. Dipakai di Impor › Jadwal Kedatangan Kapal dan versi ringkasnya
sebagai widget Ringkasan.

---

## 12. Persiapan CRUD (fase berikutnya)

Belum dibangun, tetapi tata letak sudah menyediakan tempatnya:
- Tombol primer halaman (mis. "Tambah jadwal kapal") di kanan baris judul, hanya di modul milik
  divisi pengguna.
- Aksi baris di kolom paling kanan yang tetap.
- Di modul divisi lain: tombol ubah disembunyikan, baris judul menampilkan chip netral "Hanya lihat".
- Setiap perubahan nantinya tercatat di riwayat (siapa, kapan, apa).

---

## 13. Ponsel (sekunder)

- Sidebar menjadi bar atas 48px: nama layar, menu (sheet layar penuh), maks satu aksi.
- KPI strip menjadi grid 2 kolom; Perlu perhatian naik ke atas, langsung di bawah KPI.
- Grafik lebar penuh, tinggi 160–200px, 3–4 label X.
- Tabel menjadi baris dua-lini (identitas + angka utama di lini 1, sisanya abu di lini 2).
- Mode atur tidak tersedia di ponsel; tampilan tersimpan tetap bisa dipilih.

---

## 14. Dilarang

Gradient (latar, tombol, kartu, teks) · glow, glass, backdrop blur · shadow pada kartu diam ·
ikon dalam lingkaran/kotak berwarna pada KPI atau kartu · sparkline di KPI · grafik pelangi
(> 1 hue data per grafik) · sidebar gelap atau berwarna · warna brand di nav/tab/tombol ·
header tabel huruf kapital ber-tracking · zebra · angka rata kiri · emoji · ilustrasi di state
kosong · data palsu yang tidak menjumlah (lorem, "User 1", Acme) · aksen ungu/indigo ·
kartu upsell · animasi masuk · judul > 32px atau angka ≥ 48px.

**Diambil dari referensi:** pola modal *Add Widget* dengan katalog bertag modul, kartu customer
bersegmen, toolbar periode + Add widget + Export di kanan judul, panel goal tracker sebagai pola
kuota. **Tidak diambil:** ikon berwarna di KPI, kartu upsell bergradient, sidebar dengan bar aktif
berwarna, tombol Select biru di setiap baris.

---

## 15. Keputusan dari review Stitch (27 Okt 2026)

Diambil dari hasil Stitch (layar Ringkasan mode atur):
- Nama produk **Dashboard TM**, nama lini produksi, kata "berlayar" untuk muatan dalam perjalanan.
- Strip edit di atas tiap widget (pegangan seret, ukuran, hapus/kunci).

Dikoreksi saat build:
- Batang penjualan hari-hari lalu dibuat **ink**, bukan biru pucat; hanya hari ini yang biru.
- Grafik penjualan diberi skala Y (Stitch tidak memiliki skala).
- Teks *Perlu perhatian* dan nama kapal terpotong di Stitch → teks dipendekkan, nama kapal dua baris.
- "Total manifest 21.400 t" dan "Tg. Priok & Perak" tidak sesuai data → 5 kapal · 5.740 t, Tanjung Priok.
- Dua stempel waktu (Live 18:15:42 dan Last Update 18:14:38) → satu stempel Live di baris atas.
- Ukuran widget yang tidak berlaku tidak ditampilkan (bukan tombol abu nonaktif).

---

## 16. Penjualan › Laporan Penjualan

Diturunkan dari laporan Excel "Laporan Penjualan Periode 01–24 Oktober 2026" (28 Okt 2026).

**Keputusan pengguna**
- Cabang: **Surabaya** dan **Tangerang** (menggantikan Jakarta/Surabaya/Medan di data contoh lama).
- Rekening uang masuk: **BCA PT** dan **BCA 919**.
- Periode kolom mengikuti tanggal seperti di laporan: 01–10, 12–17, 19–24 Okt. Rentang dipilih lewat
  filter tanggal di halaman. Tabel menampilkan jumlah hari kerja per periode (9, 6, 6) dan rata-rata
  per hari kerja, karena panjang periodenya tidak sama.
- **Outstanding piutang customer** = saldo semua piutang yang belum dibayar per akhir periode (kumulatif).
- Grafik penjualan bulanan: Jan–Okt 2026, dengan pilihan **tahun** (2026, 2025) dan **cabang**.

**Pertanyaan halaman:** berapa omset kita, dan berapa yang sudah menjadi uang?

**Rumus (wajib cocok di data dan di layar)**
- Omset = Penjualan cash + Penjualan piutang = Surabaya + Tangerang.
- Uang masuk = Penjualan cash + Pembayaran piutang customer = BCA PT + BCA 919.
- Outstanding akhir periode = outstanding awal + piutang baru − pembayaran piutang.

**Data contoh** (lengkap, rupiah penuh: `docs/data/laporan-penjualan-okt-2026.json`)

| | 01–10 Okt (9 hk) | 12–17 Okt (6 hk) | 19–24 Okt (6 hk) | 1–24 Okt |
|---|---:|---:|---:|---:|
| Surabaya | 8.742.656.274 | 5.964.781.014 | 5.775.724.462 | 20.483.161.750 |
| Tangerang | 8.052.356.882 | 5.511.364.857 | 5.323.887.544 | 18.887.609.283 |
| **Omset** | 16.795.013.156 | 11.476.145.871 | 11.099.612.006 | 39.370.771.033 |
| Penjualan cash | 6.636.804.179 | 4.522.223.850 | 4.429.763.525 | 15.588.791.554 |
| Penjualan piutang | 10.158.208.977 | 6.953.922.021 | 6.669.848.481 | 23.781.979.479 |
| Pembayaran piutang customer | 8.789.013.229 | 6.169.095.410 | 5.912.856.166 | 20.870.964.805 |
| **Uang masuk** | 15.425.817.408 | 10.691.319.260 | 10.342.619.691 | 36.459.756.359 |
| BCA PT | 11.039.057.922 | 7.542.535.210 | 7.148.310.459 | 25.729.903.591 |
| BCA 919 | 4.386.759.486 | 3.148.784.050 | 3.194.309.232 | 10.729.852.768 |
| Outstanding piutang (akhir) | 28.785.031.868 | 29.569.858.479 | 30.326.850.794 | — |

Outstanding 1 Okt: Rp 27.415.836.120. Naik Rp 2,91 M menjadi Rp 30,33 M per 24 Okt.

**Ringkas (yang tampil di kartu):** omset Rp 39,37 M · cash 39,6% (Rp 15,59 M) · piutang baru Rp 23,78 M ·
pembayaran piutang Rp 20,87 M (87,8% dari piutang baru) · uang masuk Rp 36,46 M (92,6% dari omset) ·
rata-rata Rp 1,87 M per hari kerja (Sep 2026: Rp 1,88 M = Rp 48,9 M / 26 hari kerja).

**Bulanan (Rp M, dibulatkan)**
- 2026: Jan 46,9 · Feb 47,0 · Mar 46,4 · Apr 47,9 · Mei 45,2 · Jun 47,0 · Jul 48,1 · Agu 51,3 · Sep 48,9 ·
  Okt 39,4 (s.d. 24 Okt; proyeksi akhir bulan 50,6).
- 2025: Jan 42,8 · Feb 39,1 · Mar 45,0 · Apr 42,9 · Mei 44,6 · Jun 43,6 · Jul 44,1 · Agu 42,7 · Sep 46,5 ·
  Okt 42,9 · Nov 43,7 · Des 46,6.
- Per cabang ada di file JSON. Hitung dari nilai rupiah penuh, bukan dari angka bulat ini.

**Susunan halaman (1440px)**
1. Judul "Laporan Penjualan" + kalimat temuan; kanan: tombol segmen `Dashboard | Format laporan`, Export.
2. Scope: rentang tanggal `1–24 Okt 2026`, cabang.
3. KPI strip 4 sel: Omset · Porsi cash · Uang masuk · Outstanding piutang.
4. XL "Penjualan bulanan" (pilihan tahun + cabang di header kartu) + M "Omset per cabang".
5. Full "Dari omset ke kas" — **elemen khas halaman**: per periode, batang omset (cash | piutang)
   di atas batang uang masuk (cash | pembayaran piutang), saldo outstanding di kanan.
6. L "Rincian per cabang" (tabel) + L "Uang masuk per rekening" (tabel).

**Mode "Format laporan"**: tiga tabel persis urutan Excel (Rincian Penjualan, Rincian Penjualan &
Pembayaran, Rincian Uang Masuk) dengan rupiah penuh, gaya tabel DESIGN.md §8. Export Excel memakai
susunan ini.

**Angka:** kartu dan grafik memakai bentuk ringkas (`Rp 39,37 M`, dua desimal di halaman ini karena
selisih antar-periode kecil); tabel memakai rupiah penuh rata kanan (`Rp 16.795.013.156`); bentuk
ringkas menampilkan angka penuh saat disorot.

**Dampak ke halaman lain:** filter Cabang di Ringkasan dan widget "Penjualan per area" ikut memakai
Surabaya/Tangerang; penjualan harian Ringkasan dihitung dari data harian per cabang yang sama
(1–24 Okt harus sama dengan Rp 39.370.771.033).

---

## 17. Penjualan › Outstanding Penjualan

Diturunkan dari contoh "Outstanding Penjualan" (29 Okt 2026). Subjudul halaman: **Pesanan belum
terkirim**. Jangan tertukar dengan *outstanding piutang* di Laporan Penjualan (sudah dikirim,
belum dibayar).

**Keputusan pengguna**
- Outstanding penjualan = pesanan (SO) yang belum terkirim. Ditampilkan per nomor SO.
- Satuan: Pipa Hollow **batang**, Cat **pail**, item lain **pcs**.
- Setiap SO punya **cabang** dan **gudang** (Gudang Surabaya, Gudang Tangerang).
- Tanggal order menyusul; nominal per item menyusul. Saat ini nominal hanya per SO.
- Customer di data asli bisa ratusan: daftar customer harus bisa dicari, diurutkan, dan dipaging.
  Tidak ada matriks customer × item.

**Buffer stok (rencana gudang)** — rumus yang dipakai:
`Sisa = Stok − Buffer − Outstanding`, dihitung **per item per gudang** (stok tidak dijumlah lintas gudang,
karena kelebihan di satu gudang tidak otomatis menutup kekurangan di gudang lain).
- **Cukup**: Sisa ≥ 0.
- **Memakai buffer**: Stok ≥ Outstanding tetapi Sisa < 0. Pesanan bisa dikirim, tetapi buffer berkurang.
  Keputusan manajemen: boleh atau tidak memakai buffer.
- **Perlu ditambah**: Stok < Outstanding. Jumlah yang perlu ditambah = −Sisa (memenuhi pesanan dan
  mengembalikan buffer).
- Selama buffer belum diatur gudang, nilainya 0 dan kolom Buffer menampilkan "–".

**Pertanyaan halaman:** pesanan mana yang belum terkirim, dan apakah stok cukup untuk memenuhinya?

**Data contoh** (lengkap: `docs/data/outstanding-penjualan-29-okt-2026.json`)

Kecukupan stok per item per gudang:

| Item | Gudang | Outstanding | Stok | Buffer | Sisa | Status |
|---|---|---:|---:|---:|---:|---|
| Besi Galvanis | Surabaya | 446 | 949 | 40 | 463 | Cukup |
| Besi Galvanis | Tangerang | 308 | 847 | 40 | 499 | Cukup |
| Besi Kait | Surabaya | 432 | 947 | 40 | 475 | Cukup |
| Besi Kait | Tangerang | 142 | 329 | 40 | 147 | Cukup |
| CNP 1.8MM | Surabaya | 12 | 74 | 40 | 22 | Cukup |
| CNP 1.8MM | Tangerang | 178 | 509 | 40 | 291 | Cukup |
| Cat Orange | Surabaya | 32 | 101 | 6 | 63 | Cukup |
| Cat Orange | Tangerang | 7 | 10 | 6 | -3 | Memakai buffer |
| Plat Bordes 2 mm | Surabaya | 659 | 1.572 | 40 | 873 | Cukup |
| Plat Bordes 2 mm | Tangerang | 61 | 188 | 40 | 87 | Cukup |
| Pipa Hollow | Surabaya | 995 | 432 | 60 | -623 | Kurang |
| Pipa Hollow | Tangerang | 80 | 259 | 60 | 119 | Cukup |
| Wiremesh M8 | Surabaya | 211 | 379 | 40 | 128 | Cukup |
| Wiremesh M8 | Tangerang | 138 | 265 | 40 | 87 | Cukup |

Pipa Hollow di Gudang Surabaya ditunggu 3 customer: PT Maju Terus 432, PT Maju Lancar 521,
PT Bumi Cipta Steel 42 (= 995 batang). Gudang Tangerang punya sisa Pipa Hollow 119 batang.

SO belum terkirim (19 SO, 18 customer, 34 baris item, total Rp 829.750.774):

| No. SO | Customer | Gudang | Item | Nominal SO |
|---|---|---|---|---:|
| SO/SBY/2610/0157 | CV Anugerah Teknik | Surabaya | Plat Bordes 2 mm 177 pcs, Besi Kait 165 pcs, Besi Galvanis 101 pcs | 125.307.023 |
| SO/SBY/2610/0171 | TB Makmur Abadi | Surabaya | Plat Bordes 2 mm 145 pcs, Besi Galvanis 65 pcs | 95.548.040 |
| SO/SBY/2610/0145 | CV Sumber Baja | Surabaya | Wiremesh M8 69 pcs, Plat Bordes 2 mm 103 pcs | 86.279.127 |
| SO/SBY/2610/0155 | TB Sentosa Jaya | Surabaya | Besi Kait 12 pcs, Plat Bordes 2 mm 134 pcs | 79.705.622 |
| SO/SBY/2610/0153 | PT Graha Rangka | Surabaya | Plat Bordes 2 mm 100 pcs | 59.621.018 |
| SO/SBY/2610/0142 | PT Maju Lancar | Surabaya | Besi Galvanis 64 pcs, Pipa Hollow 521 batang, CNP 1.8MM 12 pcs | 57.201.134 |
| SO/SBY/2610/0164 | PT Cahaya Rangka Baja | Surabaya | Wiremesh M8 142 pcs | 50.380.604 |
| SO/TGR/2610/0103 | CV Tunas Logam | Tangerang | CNP 1.8MM 178 pcs, Plat Bordes 2 mm 61 pcs | 49.846.045 |
| SO/TGR/2610/0091 | UD Sinar Bangunan | Tangerang | Wiremesh M8 138 pcs | 49.454.363 |
| SO/SBY/2610/0139 | PT Maju Terus | Surabaya | Besi Galvanis 42 pcs, Pipa Hollow 432 batang | 45.750.995 |
| SO/SBY/2610/0156 | PT Bumi Cipta Steel | Surabaya | Pipa Hollow 42 batang, Cat Orange 13 pail, Besi Galvanis 115 pcs | 35.124.993 |
| SO/TGR/2610/0096 | PT Nusa Atap | Tangerang | Besi Galvanis 168 pcs, Pipa Hollow 80 batang | 31.034.007 |
| SO/TGR/2610/0095 | PT Duta Konstruksi | Tangerang | Besi Galvanis 140 pcs, Besi Kait 70 pcs | 20.997.877 |
| SO/SBY/2610/0149 | PT Karya Logam Abadi | Surabaya | Besi Kait 86 pcs, Cat Orange 15 pail | 18.338.420 |
| SO/TGR/2610/0090 | PT Lancar Terus | Tangerang | Cat Orange 7 pail, Besi Kait 57 pcs | 8.864.572 |
| SO/SBY/2610/0161 | PT Prima Kanopi | Surabaya | Besi Galvanis 59 pcs | 8.403.333 |
| SO/SBY/2610/0152 | CV Mitra Besi Utama | Surabaya | Cat Orange 4 pail | 4.534.468 |
| SO/SBY/2610/0167 | TB Makmur Abadi | Surabaya | Besi Kait 169 pcs | 3.085.353 |
| SO/TGR/2610/0099 | UD Berkah Material | Tangerang | Besi Kait 15 pcs | 273.780 |

**Ringkas (kartu):** nilai belum terkirim Rp 829,8 jt · 19 SO · 18 customer · 1 item perlu ditambah
(Pipa Hollow, Gudang Surabaya, 623 batang) · 1 item memakai buffer (Cat Orange, Gudang Tangerang, 3 pail).

**Susunan halaman (1440px)**
1. Judul "Outstanding Penjualan", subjudul "Pesanan belum terkirim per 29 Okt 2026", kalimat temuan;
   kanan: Export.
2. Scope: cabang, gudang, cari (No. SO / customer / item).
3. KPI strip 4 sel: Nilai belum terkirim · SO / customer menunggu · Perlu ditambah · Memakai buffer.
4. Full "Kecukupan stok" — **elemen khas halaman**: satu kelompok per item, satu lajur per gudang,
   satu skala per item. Di setiap lajur: track abu sepanjang stok, dengan buffer sebagai bagian arsir
   di ujung kanan track; di atasnya batang outstanding ink. Bagian outstanding yang masuk ke buffer
   diarsir amber, bagian yang melewati stok merah. Di kanan: sisa dan status. Urutan: Perlu ditambah,
   Memakai buffer, lalu Cukup. Klik item → panel kanan berisi SO yang menunggu item itu, dan sisa item
   yang sama di gudang lain (petunjuk mutasi antar gudang).
5. Full "SO belum terkirim": tabel per SO (bisa dikelompokkan per customer), urut nominal terbesar,
   kolom item ringkas, chip status jika salah satu item kurang stok. Paging "1–25 dari 19".

**Kata dan format:** "Pesanan belum terkirim", "Perlu ditambah", "Memakai buffer", "Cukup",
"Sisa", "Buffer". Kuantitas dengan satuan (`995 batang`, `7 pail`, `446 pcs`). Nominal tabel rupiah penuh.

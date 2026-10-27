# Paket Prompt — Dashboard Manajemen

Dua bagian:
- **A. Google Stitch**: eksplorasi visual per layar.
- **B. Agent frontend** (Claude Code + taste-skill): membangun prototipe yang bisa diklik.

Keduanya membaca **DESIGN.md** yang sama, jadi warna, angka, dan istilah tidak berbeda antara
desain dan kode.

---

## A. Google Stitch

### Cara pakai

1. Buat proyek baru di Stitch (mode **Web / Desktop**), buka **Design.md** proyek, lalu ganti isinya
   dengan seluruh isi `DESIGN.md`.
2. Jalankan prompt **A0** dulu, kemudian A1–A8 **satu per satu**, masing-masing sebagai layar baru.
3. Untuk revisi, minta **satu perubahan per prompt** ("Make the alert rail rows 44px", bukan lima
   perubahan sekaligus). Stitch cenderung mengubah hal lain jika diberi banyak permintaan.
4. Instruksi ditulis dalam bahasa Inggris karena hasil Stitch lebih stabil; **teks UI tetap bahasa
   Indonesia** dan sudah ditulis persis di dalam tanda kutip.
5. Jika hasilnya melenceng (warna di sidebar, ikon dalam kotak berwarna, gradient), kirim prompt
   **A9 (koreksi)**.

---

### A0 — Arah keseluruhan (kirim sekali, sebelum layar pertama)

```
Follow the project's Design.md strictly. This is an internal real-time management dashboard
for a distribution and manufacturing company, used by directors and division managers in long
desktop sessions at 1440px. It must feel calm and trustworthy, like a ledger: neutral chrome,
colour only on data and status.

Global rules for every screen:
- Font Geist (Geist Mono only for IDs). Tabular numbers. Sentence case everywhere.
- Page ground #f2f4f7, white cards with a 1px #e3e6ea border, 8px radius, no shadows.
- Labelled left sidebar 240px on the page ground, no divider line, active item is a grey pill
  #e4e7ec with the label in ink. No coloured sidebar, no left accent bar, no upsell card.
- One data hue only: #1d5fbf, used on the main data element (current period, today, realised).
  Comparisons and targets in grey #8a8a8a. Red/amber/green only for status.
- No gradients, no glow, no glass, no emoji, no icons inside coloured circles or squares,
  no sparklines on KPIs, no uppercase table headers, no zebra rows.
- All UI text in Indonesian with English technical terms exactly as written in Design.md
  (Ringkasan, Penjualan, Gudang, Produksi, Impor, ETA, SKU, Export, Live).
- Use the sample data in Design.md section 10 exactly. Numbers must match across screens.

Do not generate a screen yet. Reply with a short confirmation of these rules.
```

---

### A1 — Ringkasan (mode lihat) · layar terpenting

```
Create the "Ringkasan" screen at 1440×900, view mode, for a user with role "Direksi".

Sidebar (240px): company mark + "{{NAMA_PERUSAHAAN}}" at top. Items: "Ringkasan" (active),
"Penjualan", "Gudang", "Produksi", "Impor" (each with a chevron, collapsed), then at the bottom
"Pengaturan", "Bantuan" and a user row "Rina Hartono · Direksi". 16px grey outline icons.

Top row of the canvas (48px): breadcrumb "Ringkasan" left; search "Cari laporan, SKU, kapal… ⌘K"
centered; right: a 6px dot + "Live · diperbarui 18:15:42", theme toggle, bell, avatar.

Title row: h1 "Ringkasan" 24/600. Under it, 14px grey: "2 kapal terlambat dan kuota Resin PP
tersisa 12,0% — keduanya perlu keputusan minggu ini." Right side, bottom-aligned: a select
"Tampilan: Direksi", secondary button "Atur tampilan", secondary button "Export". No filled
primary button on this screen.

Scope row (36px controls): date range "1–26 Okt 2026", select "Semua cabang", select
"Semua gudang".

Content grid: 12 columns, 12px gap, 1152px wide.
Row 1 (full width): ONE card split by 1px dividers into 4 equal KPI cells, no icons:
- "Penjualan hari ini" — "Rp 1,84 M" (700) — caption "95,3% dari target Rp 1,93 M"
- "Output produksi" — "412 t" — caption "91,6% dari rencana 450 t"
- "Stok kritis" — "7 SKU" — caption "dari 1.284 SKU aktif"
- "Kapal dalam perjalanan" — "5" — caption "2 terlambat" with "2 terlambat" in red #c4242a.

Row 2: left card span 8 "Penjualan Oktober": lead figure "Rp 41,2 M" 30/700, beside it grey
"79,2% dari target Rp 52,0 M" and "+6,7% vs 1–26 Sep" in green #2e7d32. Below, daily column
chart 1–31 Okt: bars 1–25 in ink #141414 (Sundays 4, 11, 18, 25 are zero, no bar), bar 26 (today) in #1d5fbf, 27–31 empty slots, a dashed
grey horizontal line for the daily target labelled "Target harian Rp 1,93 M". 4 gridlines,
no y-axis line, x labels "1", "8", "15", "22", "29" flat.
Right card span 4 "Perlu perhatian", header count "6". Five rows on a 44px pitch, each: a small
severity pill ("Kritis" pale red / "Perhatian" pale amber), one-line text, module name in grey:
1 Kritis — "Kuota Resin PP tersisa 12,0% (2.160 t)" · Impor
2 Kritis — "MV Ocean Pearl terlambat 5 hari, tiba 29 Okt" · Impor
3 Perhatian — "7 SKU di bawah stok minimum" · Gudang
4 Perhatian — "Lini 3 downtime 2 j 40 m hari ini" · Produksi
5 Perhatian — "Penjualan hari ini 95,3% dari target" · Penjualan
Footer: outlined button "Lihat semua (6)".

Row 3: three cards span 4 each, equal height:
- "Sisa kuota impor 2026": three horizontal quota tracks (Resin PP, Baja HRC, Kertas kraft).
  Each track = full quota; realised part in #1d5fbf, in-transit part as a lighter tint of it,
  remainder empty. Right of each: remaining "12,0%" (red), "40,8%" (grey), "18,3%" (amber).
- "Output vs rencana per lini": 4 rows (Lini 1–4), a grey bar with a 1px ink tick at the plan.
- "Kapal 14 hari ke depan": 5 compact rows: ship name, ETA date, status pill
  ("Tepat waktu" pale green / "Terlambat 5 hari" pale red).
Each card header has a ⋯ menu on the right. Calm, dense but airy, everything above the fold.
```

---

### A2 — Ringkasan (mode atur)

```
Duplicate the "Ringkasan" screen and switch it to edit mode.
- Replace the title-row buttons with a toolbar: "Tambah widget" (secondary, plus icon),
  "Reset ke default" (text button), "Batal" (secondary), "Simpan" (filled #141414, white label —
  the only filled button on screen).
- Under the title, grey text: "Seret untuk memindahkan. Perubahan hanya untuk tampilan Anda."
- Show the 12-column grid behind the cards as faint dashed column outlines.
- Every widget gets: a drag handle (6-dot grip) top-left, a size select "S · M · L · XL · Full"
  and an "×" remove button top-right. The KPI strip and "Perlu perhatian" show a small lock icon
  instead of "×" (they cannot be removed).
- One widget ("Output vs rencana per lini") is being dragged: lifted with a soft shadow,
  its original slot shown as a dashed empty box of the same size.
Keep all data identical.
```

---

### A3 — Panel "Tambah widget"

```
On top of the edit-mode Ringkasan, open a right-side sheet 480px wide (white, soft shadow,
dim the page behind with 20% black). Title "Tambah widget", close "×".
- Search field "Cari widget".
- Underline tabs: "Semua", "Penjualan", "Gudang", "Produksi", "Impor". "Impor" is selected.
- List of widget rows (no coloured icon boxes). Each row: a 96×64 thumbnail drawn in grey and
  ink lines (a tiny chart preview), name 14/500, one-line grey description, default size chip,
  and a secondary button "Tambah" on the right.
  1 "Sisa kuota per komoditas" — "Kuota terpakai, dalam perjalanan, dan sisa." — M —
    button replaced by grey text "Sudah ditambahkan"
  2 "Jalur kedatangan kapal" — "Kapal 14 hari ke depan pada sumbu tanggal." — XL
  3 "Nilai impor bulan ini" — "Total nilai impor dan perbandingan bulan lalu." — S
  4 "Dokumen tertahan" — "PIB dan dokumen yang belum selesai." — M
- Sheet footer: grey "Widget mengikuti filter global halaman."
```

---

### A4 — Impor › Jadwal Kedatangan Kapal (elemen khas produk)

```
Create the "Jadwal Kedatangan Kapal" screen. Sidebar: "Impor" expanded showing
"Laporan Impor", "Kuota Impor", "Jadwal Kedatangan Kapal" (active), "Status Dokumen".
Breadcrumb "Impor / Jadwal Kedatangan Kapal". h1 "Jadwal Kedatangan Kapal".
Subline: "5 kapal dalam perjalanan membawa 5.740 t. 2 terlambat dari ETA awal."
Right: secondary "Export". Scope row: "20 Okt – 10 Nov 2026", select "Semua komoditas",
select "Tanjung Priok".

Main card (full width) "Jalur kedatangan": a lane timeline. Ships down the left in a 200px
column (name 14/500, commodity + tonnage in grey below). Days across 20 Okt–10 Nov with faint
1px day lines, weekends one tone darker, today (26 Okt) a 1px #1d5fbf vertical line labelled
"Hari ini". Each lane: a grey line from departure to estimated arrival; a hollow tick at the
original ETA; an ink dot at the current estimate; for late ships the segment between original
ETA and new estimate in red #c4242a with label "+5 hari" / "+2 hari".
Use exactly the 5 ships from Design.md section 10.

Below, full-width table card "Detail kapal": columns Kapal, Komoditas, Muatan (right-aligned,
"900 t"), Asal, ETA awal, Estimasi tiba, Status (pill). 5 rows, 44px, 1px light row rules,
grey sentence-case headers, no zebra.
```

---

### A5 — Impor › Kuota Impor

```
Create the "Kuota Impor" screen. Breadcrumb "Impor / Kuota Impor". h1 "Kuota Impor".
Subline: "Kuota Resin PP tersisa 12,0% — pada laju saat ini habis sekitar 11 Des 2026."
Scope row: select "Tahun kuota 2026".

Row 1: one card split into 3 cells: "Total kuota 51.000 t", "Terealisasi 31.650 t",
"Dalam perjalanan 5.740 t" (caption "5 kapal").

Row 2: card span 8 "Pemakaian kuota per komoditas": three large quota tracks (24px tall),
each with label left, track = full quota, realised in #1d5fbf, in-transit lighter tint,
remaining empty with a 1px border; both ends labelled ("14.200 t terealisasi" ... "18.000 t").
Right of each track: "Sisa 2.160 t · 12,0%" (red for Resin PP), "Sisa 9.800 t · 40,8%" (grey),
"Sisa 1.650 t · 18,3%" (amber).
Card span 4 "Proyeksi habis": a single line chart for Resin PP cumulative usage Jan–Des,
solid until today, dashed after, horizontal grey line at 18.000 t, end label "habis ±15 Des".

Row 3: table "Riwayat realisasi" — No. PIB (Geist Mono), Tanggal, Komoditas, Kapal,
Volume (right), Kuota terpakai % (right). 5 rows + "Lihat semua".
```

---

### A6 — Gudang › Posisi Stok (pola halaman daftar)

```
Create the "Posisi Stok" screen. Sidebar "Gudang" expanded: "Posisi Stok" (active),
"Mutasi Stok", "Stok Kritis & Aging", "Stock Opname".
h1 "Posisi Stok". Subline: "7 dari 1.284 SKU di bawah stok minimum. Nilai stok Rp 128,4 M."
Right: secondary "Export".
Scope row: search "Cari SKU atau nama barang" (256×32), select "Semua gudang",
segmented control "Semua · Di bawah minimum (7) · Berlebih".
Full-width table card, header sticky. Above table, grey "1.284 SKU".
Columns: Kode SKU (Geist Mono), Nama barang, Gudang, Stok (right, "1.240 kg"),
Minimum (right), Cakupan (right, "6 hari"), Status. Rows below minimum show a pale red pill
"Di bawah minimum" and their Stok number in red; all other rows have no pill.
12 rows, 44px. Footer: "1–50 dari 1.284" with previous/next.
```

---

### A7 — State: loading, kosong, error, terputus

```
Create one board showing 4 copies of the "Sisa kuota impor 2026" card side by side, labelled
below each in grey: "Loading", "Kosong", "Error", "Terputus".
- Loading: same layout, values replaced by flat grey bars of the real size, labels visible,
  no shimmer.
- Kosong: frame and header kept, one sentence "Belum ada kuota untuk tahun 2027."
- Error: one sentence "Gagal memuat kuota. Data terakhir 18:12." and a text button "Coba lagi";
  a small red icon only.
- Terputus: data still visible, header stamp in amber "Terputus · data terakhir 18:12".
```

---

### A8 — Ringkasan versi ponsel (390px)

```
Create a 390px mobile version of "Ringkasan".
Top bar 48px: menu icon, "Ringkasan", bell. Under it the subline sentence.
Select "Tampilan: Direksi" full width. KPI as a 2×2 grid. Then "Perlu perhatian" (5 rows,
44px touch targets). Then "Penjualan Oktober" chart full width, 180px tall, 4 x labels.
Then "Sisa kuota impor 2026". No edit mode on mobile. Margins 16px.
```

---

### A9 — Koreksi (pakai bila hasil melenceng)

```
Revise this screen to follow Design.md: remove all colour from the sidebar, header and buttons
(only one filled #141414 button allowed, and only in edit mode); remove icon containers and
any gradient or shadow on resting cards; keep #1d5fbf only on the main data element;
make table headers 12px grey sentence case; right-align all numbers. Change nothing else.
```

Untuk modul **Penjualan** dan **Produksi**, salin pola A4–A6: halaman laporan berbentuk *report*
(A4/A5) dan daftar berbentuk *list* (A6), ganti judul, kalimat temuan, dan data dari Design.md §11.

---

## B. Agent frontend (Claude Code + taste-skill)

### Persiapan

```bash
npx skills add https://github.com/Leonxlnx/taste-skill
```

Nama skill setelah terpasang adalah **`design-taste-frontend`**. Taruh `DESIGN.md` di root repo.
Jika ada hasil Stitch yang disukai, export HTML/screenshot-nya ke folder `stitch/` sebagai acuan.

### Prompt B1 — Prototipe fase 1

```
Gunakan skill design-taste-frontend untuk app screens (baca references/app-screens.md seluruhnya
dulu). Acuan utama proyek ini adalah DESIGN.md di root repo; ikuti token, glosarium, dan data
contohnya. Jika ada folder stitch/, pakai sebagai acuan tata letak, tapi DESIGN.md menang jika
berbeda.

Style: deal ulang dengan
  draw.mjs --app --kind analytics --style achromatic-ledger --screens overview,report,list --theme light
Shell: JANGAN pakai shell yang dibagikan (no sidebar / icon rail). Pakai open plane dengan sidebar
berlabel 240px sesuai DESIGN.md §5 — alasan: 4 modul × 3–5 sub-menu yang labelnya harus terbaca.
Catat override ini di laporan.

Stack: [isi stack tim, mis. React + Vite + TypeScript]. Tanpa backend; data dari
src/data/sample.ts yang dibangun dari DESIGN.md §10, dengan console.assert untuk setiap total
(penjualan harian 1–26 Okt harus berjumlah Rp 41,2 M dengan Minggu = 0; terealisasi + dalam perjalanan + sisa =
kuota; jumlah muatan 5 kapal = 5.740 t). Simulasikan real-time dengan update tiap 5 detik pada
penjualan hari ini dan stempel "Live · diperbarui".

Bangun layar ini, masing-masing dengan route sendiri:
1. /ringkasan — mode lihat dan mode atur (drag, ubah ukuran S/M/L/XL/Full, hapus, simpan ke
   localStorage per tampilan), panel "Tambah widget" dari kanan, switcher tampilan
   (Direksi, Manajer Impor), Export (menu saja).
2. /impor/jadwal-kapal — termasuk elemen khas "Jalur kedatangan kapal" (DESIGN.md §11).
3. /impor/kuota — track kuota (Charts.plan) dan proyeksi habis.
4. /gudang/posisi-stok — halaman daftar dengan filter dan paging.
Sub-menu lain cukup halaman dengan h1, breadcrumb, dan state kosong yang jujur.

Wajib: state loading/kosong/error/terputus untuk setiap blok, tema dark (DESIGN.md §3.2),
tampilan 390px sesuai §13, klik widget Ringkasan = drill-down ke halaman asal dengan filter terbawa.

Setelah build jalankan lint.mjs --app dan inspect.mjs --app, perbaiki semua FAIL, maksimal
3 putaran. Laporkan: style + seed, override shell, face (ground #f2f4f7 + hue #1d5fbf pada data
utama), elemen khas, pertanyaan tiap layar, dan daftar data contoh yang harus diganti data asli.
```

### Prompt B2 — Menambah modul berikutnya (pakai berulang)

```
Tambahkan halaman [Modul] › [Sub-menu] mengikuti DESIGN.md dan pola halaman yang sudah ada
(report seperti /impor/kuota, list seperti /gudang/posisi-stok). Tulis dulu di catatan:
pertanyaan utama layar ini, satu kalimat temuan, dan blok-bloknya. Tambahkan datanya ke
src/data/sample.ts dengan assertion. Daftarkan widget yang disumbangkan halaman ini ke katalog
"Tambah widget" (DESIGN.md §11). Jalankan lint dan inspect.
```

---

## Urutan kerja yang disarankan

1. Konfirmasi sub-menu dan KPI (DESIGN.md §11) dengan manajemen.
2. Stitch A0 → A1. Review A1 bersama pengguna sebelum lanjut, karena semua layar mewarisinya.
3. Stitch A2–A8.
4. Perbarui DESIGN.md dengan keputusan dari review (DESIGN.md adalah sumber, bukan Stitch).
5. Agent B1, lalu B2 per modul.

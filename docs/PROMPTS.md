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

## C. Penjualan › Laporan Penjualan

Spesifikasi dan data contoh lengkap: **DESIGN.md §16** dan `docs/data/laporan-penjualan-okt-2026.json`.
Pastikan Design.md di proyek Stitch sudah diperbarui dengan §16 sebelum menjalankan prompt ini.
Jalankan berurutan, satu layar per prompt. Kalau hasilnya melenceng, pakai A9.

### A10 — Laporan Penjualan (tampilan dashboard)

```
Create the "Laporan Penjualan" screen at 1440px, following Design.md (section 16 for this page).
Same shell as "Ringkasan": labelled sidebar with "Penjualan" expanded showing "Laporan Penjualan"
(active), "Target vs Realisasi", "Per Pelanggan/Area", "Piutang". Breadcrumb "Penjualan / Laporan
Penjualan". The page should feel like a calm financial ledger, not a spreadsheet: generous spacing,
no heavy borders, numbers right-aligned in tabular figures.

Title row: h1 "Laporan Penjualan". Subline, 14px grey: "Omset 1–24 Okt Rp 39,37 M. Pembayaran
piutang Rp 20,87 M lebih kecil dari piutang baru Rp 23,78 M, sehingga outstanding naik Rp 2,91 M
menjadi Rp 30,33 M." Right side: a two-option segmented control "Dashboard | Format laporan"
(Dashboard selected) and a secondary button "Export".
Scope row: date range button "1–24 Okt 2026" with a calendar icon, select "Semua cabang".

Row 1 — one card split by 1px dividers into 4 KPI cells, no icons:
- "Omset" — "Rp 39,37 M" (700) — caption "21 hari kerja · Rp 1,87 M per hari (Sep Rp 1,88 M)"
- "Porsi cash" — "39,6%" — caption "Cash Rp 15,59 M · piutang baru Rp 23,78 M"
- "Uang masuk" — "Rp 36,46 M" (700) — caption "92,6% dari omset"
- "Outstanding piutang" — "Rp 30,33 M" (700) — caption "naik Rp 2,91 M sejak 1 Okt" with
  "naik Rp 2,91 M" in red #c4242a (rising receivables is bad).

Row 2 — card span 8 "Penjualan bulanan". Header right: a small segmented control "2026 | 2025"
and a select "Semua cabang". Column chart Jan–Okt 2026 in Rp M (values from Design.md §16):
Jan–Sep bars in ink #141414, Okt bar in #1d5fbf showing 39,4 with label "s.d. 24 Okt", and above
it a dashed outline continuing to 50,6 labelled "proyeksi 50,6". Square bars, 4 faint gridlines,
y ticks "0", "20 M", "40 M", "60 M", no y-axis line, flat month labels. A hover tooltip on Agu
shows "Agustus 2026 · Rp 51,3 M · Surabaya Rp 27,0 M · Tangerang Rp 24,4 M".
Card span 4 "Omset per cabang": two rows, each with the branch name, a thin bar proportional
to its share, the share and the compact value: "Surabaya 52,0% Rp 20,48 M", "Tangerang 48,0%
Rp 18,89 M". Under them, a small grey note "Surabaya unggul di ketiga periode."

Row 3 — full-width card "Dari omset ke kas" (the signature element of this page). One row per
period: "01–10 Okt · 9 hari kerja", "12–17 Okt · 6 hari kerja", "19–24 Okt · 6 hari kerja".
Each row has two stacked horizontal bars on one shared scale:
- top bar "Omset": cash part in ink, piutang part in light grey #d4d4d4; total label at the end
  ("Rp 16,80 M");
- bottom bar "Uang masuk": cash part in ink (same length as above), "pembayaran piutang" part in
  #1d5fbf; total label at the end ("Rp 15,43 M").
At the right end of each row, a column "Outstanding" with the period-end balance
("Rp 28,79 M", "Rp 29,57 M", "Rp 30,33 M") and a small red "+Rp 1,37 M", "+Rp 0,78 M",
"+Rp 0,76 M". Legend in the card header: Cash · Piutang · Pembayaran piutang.

Row 4 — two cards span 6:
- "Rincian per cabang": table with columns Cabang, 01–10 Okt, 12–17 Okt, 19–24 Okt, Total.
  Rows Surabaya, Tangerang, Total (Total row in 500 weight). Full rupiah values from Design.md §16,
  e.g. "Rp 8.742.656.274". Under each period header a grey 12px average per working day: "Rp 1,87 M/hari", "Rp 1,91 M/hari",
  "Rp 1,85 M/hari".
- "Uang masuk per rekening": same columns, rows BCA PT, BCA 919, Total.
Grey sentence-case headers, light row rules, no zebra, no uppercase, numbers right-aligned.
```

### A11 — Laporan Penjualan (Format laporan)

```
Duplicate "Laporan Penjualan" and switch the segmented control to "Format laporan".
Replace rows 2–4 with three report tables, in this order, each in its own full-width card, keeping
the KPI strip on top. These mirror the company's Excel report so finance staff recognise it, but
styled by Design.md: no grid of heavy borders, light row rules only, grey sentence-case headers,
full rupiah values right-aligned.
1. "Rincian penjualan": No, Cabang, 01–10 Okt, 12–17 Okt, 19–24 Okt, Total. Rows Surabaya,
   Tangerang, Total. Below the table, one line: "Total omset 1–24 Okt" right-aligned
   "Rp 39.370.771.033".
2. "Rincian penjualan & pembayaran": No, Keterangan, three period columns, Total.
   Group "Penjualan" with indented rows Cash, Piutang, Total. Group "Pembayaran / uang masuk"
   with indented rows Penjualan cash, Piutang customer, Total. Then "Outstanding piutang customer"
   (Total column shows "–" because it is a balance, not a sum). Group labels in 500 weight;
   subtotal rows separated by a slightly stronger rule.
3. "Rincian uang masuk": No, Rekening, three period columns, Total. Rows BCA PT, BCA 919, Total.
Use the exact values from Design.md §16.
```

### A12 — Grafik bulanan: tahun 2025 dan cabang Surabaya

```
On the "Laporan Penjualan" dashboard view, show the "Penjualan bulanan" card in another state:
year "2025" selected and branch "Surabaya" selected. Twelve bars Jan–Des 2025 for Surabaya only
(values in Design.md §16 JSON, e.g. Jan 21,9 · Des 23,7), all in ink, no projection, no blue bar
because the year is complete. Card subtitle in grey: "Surabaya · total 2025 Rp 272,3 M".
Change nothing else.
```

### A13 — Laporan Penjualan versi ponsel (390px)

```
Create a 390px mobile version of the "Laporan Penjualan" dashboard view. Top bar 48px with menu,
"Laporan Penjualan" and a bell. Subline sentence, then date range and branch as full-width
controls. KPI as a 2×2 grid. "Penjualan bulanan" full width, 200px tall, labels every other month.
"Dari omset ke kas": one period per block, the two bars stacked, outstanding under them.
Tables become two-line rows: branch or account name with total on line 1, the three periods in
grey on line 2. The "Format laporan" option stays as a segmented control under the title.
```

### B3 — Agent: bangun halaman Laporan Penjualan

```
Gunakan skill design-taste-frontend (references/app-screens.md). Bangun halaman
Penjualan › Laporan Penjualan di route /penjualan/laporan mengikuti DESIGN.md §16 (menang atas
hasil Stitch; pakai screenshot Stitch A10–A13 di docs/stitch/ sebagai acuan tata letak jika ada).

Data:
- Pindahkan data contoh ke rupiah penuh. Sumber: docs/data/laporan-penjualan-okt-2026.json
  (harian per cabang: total, cash, piutang). Ringkasan harus dihitung dari data harian yang sama;
  ganti cabang menjadi Surabaya dan Tangerang di filter dan widget area.
- console.assert untuk setiap rumus §16: omset = cash + piutang = Surabaya + Tangerang;
  uang masuk = cash + pembayaran piutang = BCA PT + BCA 919; outstanding berantai per periode;
  1–24 Okt = Rp 39.370.771.033; angka ringkas yang tampil cocok dengan selisih dari angka tampil.

Komponen baru:
- MonthlyBars (kolom per bulan, pilihan tahun dan cabang, bulan berjalan biru + proyeksi
  putus-putus, tooltip rincian cabang).
- CashFlowRows ("Dari omset ke kas", skala bersama untuk semua periode).
- Tabel rupiah penuh; komponen Money yang menampilkan bentuk ringkas dengan angka penuh di title.
- Toggle Dashboard | Format laporan (simpan pilihan per pengguna di localStorage, try/catch).
- Export Excel memakai susunan Format laporan.

Widget baru untuk Ringkasan (registry.tsx): "Uang masuk vs omset" (M) dan "Penjualan bulanan" (XL).
Daftarkan halaman di config/dashboard.php dan lib/nav.ts (built: true).

Setelah selesai: npm run typecheck, npm run preview:build, lint.mjs --app, inspect.mjs --app di
1440/768/390. Perbaiki semua FAIL. Laporkan pertanyaan layar, elemen khas, dan data yang harus
diganti data asli.
```

---

## D. Penjualan › Outstanding Penjualan

Spesifikasi dan data contoh lengkap: **DESIGN.md §17** dan
`docs/data/outstanding-penjualan-29-okt-2026.json`. Perbarui Design.md di Stitch dengan §17 dulu.

### A14 — Outstanding Penjualan (tampilan utama)

```
Create the "Outstanding Penjualan" screen at 1440px following Design.md (section 17).
Sidebar: "Penjualan" expanded with "Laporan Penjualan", "Outstanding Penjualan" (active),
"Target vs Realisasi", "Per Pelanggan/Area", "Piutang". Breadcrumb "Penjualan / Outstanding
Penjualan". Calm ledger feel: generous spacing, light rules, tabular right-aligned numbers.

Title row: h1 "Outstanding Penjualan"; under it a 14px grey line "Pesanan belum terkirim per
29 Okt 2026"; then the finding, 14px ink: "19 SO dari 18 customer senilai Rp 829,8 jt belum
terkirim. Pipa Hollow di Gudang Surabaya perlu ditambah 623 batang; 3 customer menunggu barang
ini." Right side: secondary button "Export".
Scope row: select "Semua cabang", select "Semua gudang", search field "Cari No. SO, customer, item".

Row 1 — one KPI card split by 1px dividers into 4 cells, no icons:
- "Nilai belum terkirim" — "Rp 829,8 jt" (700) — caption "19 SO"
- "Customer menunggu" — "18" — caption "34 baris item"
- "Perlu ditambah" — "1 item" with the number in red #c4242a — caption "Pipa Hollow · Gudang Surabaya"
- "Memakai buffer" — "1 item" with the number in amber #92400e — caption "Cat Orange · Gudang Tangerang"

Row 2 — full-width card "Kecukupan stok" (the signature element of this page). Header right: a
legend: "Stok" (light grey track), "Buffer" (diagonal hatch), "Outstanding" (ink bar),
"Masuk buffer" (amber hatch), "Kurang" (red). One group per item, sorted: problems first.
Each group: item name and unit on the left (e.g. "Pipa Hollow · batang"), then one lane per
warehouse ("Surabaya", "Tangerang"), all lanes of an item on one shared scale. In each lane:
a 10px light-grey track as long as the stock, its last part hatched as buffer; on top, an ink
outstanding bar from zero. Where outstanding goes into the buffer, that part is amber-hatched;
where it goes past the stock, that part is red and extends beyond the track. At the right of
each lane, in a fixed column: "Outstanding 995 · Stok 432 · Buffer 60" in grey 13px, the
remainder "Sisa −623" (red if negative), and a status pill: "Perlu ditambah" (pale red),
"Memakai buffer" (pale amber) or "Cukup" (neutral grey).
Show these groups from Design.md §17: Pipa Hollow (Surabaya: perlu ditambah, sisa −623;
Tangerang: cukup, sisa 119), Cat Orange (Tangerang: memakai buffer, sisa −3; Surabaya: cukup,
sisa 63), Besi Galvanis, Wiremesh M8, Plat Bordes 2 mm (both lanes cukup). Under the groups,
a text link "Tampilkan 2 item lain (cukup)".

Row 3 — full-width card "SO belum terkirim". Header: a segmented control "Per SO | Per customer"
(Per SO selected) and grey "19 SO". Table columns: No. SO (Geist Mono), Customer, Gudang,
Item (one line, comma separated with quantity and unit, e.g. "Pipa Hollow 521 batang, Besi
Galvanis 64 pcs, CNP 1.8MM 12 pcs", truncated with ellipsis and full text on hover), Nominal
(full rupiah, right-aligned), Status (a pale red pill "Stok kurang" only on SOs containing
Pipa Hollow from Gudang Surabaya; nothing on the others). Sorted by nominal, largest first.
Show 10 rows from Design.md §17, starting with "SO/SBY/2610/0157 · CV Anugerah Teknik ·
Rp 125.307.023". Footer: "1–10 dari 19" with Sebelumnya / Berikutnya buttons.
```

### A15 — Panel item: siapa yang menunggu Pipa Hollow

```
On "Outstanding Penjualan", the user clicked the Pipa Hollow group. Open a right-side panel
440px wide (white, soft shadow, page dimmed 20%). Title "Pipa Hollow · Gudang Surabaya", close ×.
Top: three figures in one row: "Outstanding 995 batang", "Stok 432", "Perlu ditambah 623" (red).
Section "Menunggu barang ini (3 SO)": rows with No. SO in mono, customer, quantity right-aligned:
"SO/SBY/2610/0142 · PT Maju Lancar · 521 batang", "SO/SBY/2610/0139 · PT Maju Terus ·
432 batang", "SO/SBY/2610/0156 · PT Bumi Cipta Steel · 42 batang". Total row "995 batang".
Section "Di gudang lain": one row "Gudang Tangerang · sisa 119 batang setelah buffer" with a
text link "Lihat Posisi Stok". A grey note at the bottom: "Urutan prioritas SO akan memakai
tanggal order setelah datanya tersedia." In the main table, the 3 SOs are highlighted with the
selected-row fill.
```

### A16 — Per customer (data ratusan customer)

```
On "Outstanding Penjualan", switch the "SO belum terkirim" card to "Per customer". Each row is
one customer: name, cabang, number of SO, number of item lines, total nominal (full rupiah,
right-aligned), and a pale red pill "Stok kurang" if any of its SOs is short. Rows can expand
(chevron at the left) to show that customer's SOs as indented sub-rows. Expand "TB Makmur Abadi"
showing its 2 SOs (SO/SBY/2610/0171 Rp 95.548.040 and SO/SBY/2610/0167 Rp 3.085.353, total
Rp 98.633.393). Above the table: grey "18 customer" and a sort select "Nominal terbesar".
Footer paging "1–10 dari 18". This view must work for hundreds of customers: no matrix,
no wrapping rows, sticky header.
```

### A17 — Versi ponsel (390px)

```
Create a 390px mobile version of "Outstanding Penjualan". Top bar 48px with menu, title and
bell. Subtitle and finding sentence. Filters collapse into one row: "Semua gudang" select and a
"Filter" button. KPI as a 2×2 grid. "Kecukupan stok": one block per item and warehouse with the
bar full width, and the figures and status on the line under it; problems first. "SO belum
terkirim" as two-line rows: customer and nominal on line 1, No. SO and items in grey on line 2,
status pill at the right.
```

### B4 — Agent: bangun halaman Outstanding Penjualan

```
Gunakan skill design-taste-frontend (references/app-screens.md). Bangun halaman
Penjualan › Outstanding Penjualan di route /penjualan/outstanding mengikuti DESIGN.md §17
(menang atas hasil Stitch; screenshot A14–A17 di docs/stitch/ sebagai acuan tata letak jika ada).
Tambahkan sub-menu di config/dashboard.php dan lib/nav.ts (label "Outstanding Penjualan", built: true).

Data: resources/js/data/outstanding.ts dibangun dari docs/data/outstanding-penjualan-29-okt-2026.json.
Bentuk data siap untuk ratusan customer (array SO dengan items[]; stok per item per gudang dengan
buffer). console.assert: outstanding per item per gudang = jumlah qty SO; sisa = stok − buffer −
outstanding; status sesuai aturan §17; total nominal = Rp 829.750.774; jumlah customer = 18.
Item yang sama harus ada di Gudang › Posisi Stok dengan stok yang sama.

Komponen baru:
- StockCoverage (elemen khas "Kecukupan stok"): skala per item, lajur per gudang, buffer arsir,
  bagian masuk buffer amber arsir, bagian kurang merah. Urutan masalah dulu.
- Panel item (sheet kanan) dengan SO yang menunggu dan sisa di gudang lain.
- Tabel SO dengan mode Per SO / Per customer (baris bisa dibuka), cari, urut, paging 25 per halaman,
  header sticky. Pencarian dan filter cabang/gudang mengubah KPI dan kalimat temuan.
- Status buffer: jika buffer 0 untuk semua item, sembunyikan legenda Buffer dan tampilkan "–".

Widget baru untuk Ringkasan: "Pesanan belum terkirim" (M): nilai, jumlah SO, dan item yang perlu
ditambah. Item "Perlu ditambah" juga masuk panel "Perlu perhatian" (Kritis).

Setelah selesai: npm run typecheck, npm run preview:build, lint.mjs --app, inspect.mjs --app di
1440/768/390. Perbaiki semua FAIL.
```

---

## E. Gudang › Stok Kritis & Aging (eksplorasi)

Konsep dan data contoh: **DESIGN.md §18** dan `docs/data/stok-kritis-aging-30-okt-2026.json`.
Halaman ini masih eksplorasi: hasil Stitch dipakai untuk memilih arah, bukan final. Perbarui
Design.md di Stitch dengan §18 dulu.

### A18 — Tab Stok kritis

```
Create the "Stok Kritis & Aging" screen at 1440px following Design.md (section 18), tab
"Stok kritis" selected. Sidebar: "Gudang" expanded with "Posisi Stok", "Mutasi Stok",
"Stok Kritis & Aging" (active), "Stock Opname". Breadcrumb "Gudang / Stok Kritis & Aging".
Calm ledger feel; colour only for status and the one data hue #1d5fbf.

Title row: h1 "Stok Kritis & Aging". Finding, 14px: "7 dari 20 item perlu tindakan. Pipa Hollow
kritis di kedua gudang; outstanding SO 995 batang di Surabaya melebihi stok 432." Right side:
secondary button "Export".
Under the title: underline tabs "Stok kritis 7 | Aging". Scope row: select "Semua gudang",
select "Semua kategori", search "Cari item".

Row 1 — one KPI card split into 4 cells, no icons:
- "Perlu ditambah" — "1" in red #c4242a — caption "Pipa Hollow · Surabaya"
- "Memakai buffer" — "2" in amber #92400e — caption "Cat Orange, Kawat Bendrat"
- "Waspada" — "4" — caption "stok di bawah titik pesan ulang"
- "Cakupan terpendek" — "0 hari" — caption "Pipa Hollow · Surabaya"

Row 2 — full-width card "Prioritas pesan ulang" (signature element). One row per item × warehouse,
sorted worst first, 7 rows from Design.md §18. Columns: status pill ("Perlu ditambah" pale red,
"Memakai buffer" pale amber, "Waspada" neutral grey), Item (name + grey warehouse under it),
then a "Cakupan" timeline column 360px wide on a shared axis 0–30 hari with ticks 0, 7, 14, 21,
30: an ink bar from 0 to the coverage days (0, 1,8, 5,1, 4,7, 5,6, 6,1, 13,5) and a vertical
1px #1d5fbf tick at that item's lead time (21, 10, 7, 21, 21, 14, 14 hari) labelled "lead time"
on the first row only; the gap between bar end and tick is what is missing. Then right-aligned
columns Stok, Outstanding SO, Buffer, Saran tambah (500 weight, with unit, e.g. "1.308 batang").
Last column: a ghost button "Lihat SO" on rows with outstanding, and on the CNP 1.8MM row a text
action "Mutasi dari Tangerang (509 pcs)".

Row 3 — two cards span 6:
- "Perlu tindakan per gudang": two rows, Surabaya and Tangerang, each a thin stacked bar of
  status counts (Surabaya: 1 perlu ditambah, 1 waspada; Tangerang: 2 memakai buffer, 3 waspada)
  with the counts written beside it.
- "Cara membaca status": a compact key-value well explaining the four statuses in one line each,
  using the formulas from Design.md §18 in plain words (no code).
```

### A19 — Tab Aging

```
Same screen, tab "Aging" selected. Finding line changes to: "Rp 277,8 jt (14,8%) tertahan di
stok berumur lebih dari 90 hari. Gudang Tangerang menyumbang separuhnya."

Row 1 — KPI card, 4 cells:
- "Nilai persediaan" — "Rp 1,87 M" (700) — caption "20 item · 2 gudang"
- "Stok > 90 hari" — "Rp 277,8 jt" (700) — caption "14,8% dari nilai persediaan"
- "Stok > 180 hari" — "Rp 123,6 jt" — caption "6,6%"
- "Lambat bergerak" — "3 item" — caption "Rp 212,9 jt"

Row 2 — card span 8 "Umur stok per gudang" (signature element): two horizontal 100% stacked bars
(Semua gudang on top as a reference, then Surabaya, Tangerang), five segments 0–30, 31–60,
61–90, 91–180, >180 hari in one hue ramp from very light blue to #1d5fbf, with 2px seams; values
in Rp under each segment. Segments over 90 days get a thin red underline. Legend as a small table
under the bars: umur, nilai, persen (980,6 jt 52,3% · 401,6 jt 21,4% · 214,7 jt 11,5% ·
154,3 jt 8,2% · 123,6 jt 6,6%).
Card span 4 "Lambat bergerak": 3 rows with item, warehouse, quantity with unit, value, and a grey
reason ("tanpa pemakaian 90 hari", "cakupan 692 hari", "cakupan 281 hari"). Footer text link
"Lihat semua item".

Row 3 — full-width card "Item dengan stok lama terbesar": table columns Item, Gudang,
0–30 / 31–60 / 61–90 / 91–180 / >180 as quantities with unit (right-aligned), Nilai > 90 hari
(right-aligned, 500), and a tiny inline 5-segment bar per row in the same ramp. Rows: Pipa Hollow
4x4 tebal 2 mm (Tangerang), Plat Bordes 2 mm (Surabaya), Galvalum 0,35 mm (Tangerang), Cat Hijau
Army (Surabaya), Besi Galvanis (Surabaya). On the Plat Bordes row, a grey note under the item:
"Cepat terpakai, tetapi 125 pcs > 90 hari — cek FIFO".
```

### A20 — Panel item: Pipa Hollow

```
On the "Stok kritis" tab, the user clicked Pipa Hollow · Surabaya. Open a right-side panel 440px
(white, soft shadow, page dimmed 20%). Title "Pipa Hollow · Gudang Surabaya", status pill
"Perlu ditambah". Figures in a 2-column key-value well: Stok 432 batang · Outstanding SO 995 ·
Buffer 60 · Pemakaian 32,6 batang/hari · Lead time 21 hari · Titik pesan ulang 1.740 ·
Saran tambah 1.308 batang (500 weight).
Section "Di gudang lain": "Gudang Tangerang · stok 259 · juga Waspada" with a grey note
"Mutasi tidak menutup kekurangan".
Section "Umur stok": the 5-segment bar for this item (289 · 80 · 38 · 19 · 6 batang).
Section "Menunggu barang ini": 3 SO rows (SO/SBY/2610/0142 PT Maju Lancar 521, SO/SBY/2610/0139
PT Maju Terus 432, SO/SBY/2610/0156 PT Bumi Cipta Steel 42) with a link "Buka Outstanding Penjualan".
```

### A21 — Versi ponsel (390px)

```
Create a 390px mobile version of "Stok Kritis & Aging", tab "Stok kritis". Top bar 48px with menu,
title and bell. Finding sentence, then tabs "Stok kritis 7 | Aging" scrolling sideways, and one
filter row (gudang select + "Filter" button). KPI 2×2. "Prioritas pesan ulang" as cards-in-a-list:
line 1 status pill + item + warehouse, line 2 the coverage bar with the lead-time tick full width,
line 3 grey "Stok 432 · SO 995 · Saran +1.308 batang". 44px touch targets.
```

### B5 — Agent: bangun halaman Stok Kritis & Aging

```
Gunakan skill design-taste-frontend (references/app-screens.md). Bangun Gudang › Stok Kritis &
Aging di route /gudang/kritis mengikuti DESIGN.md §18 dan arah Stitch yang dipilih (docs/stitch/).
Data dari docs/data/stok-kritis-aging-30-okt-2026.json ke resources/js/data/stok.ts; stok, buffer
dan outstanding harus sama dengan data Outstanding Penjualan dan Posisi Stok (satu sumber).
console.assert: jumlah kelompok umur = stok per baris; nilai per kelompok menjumlah ke
Rp 1.874.676.700; status dan saran tambah sesuai rumus §18.
Tab Stok kritis / Aging sebagai route anak (/gudang/kritis dan /gudang/kritis?tab=aging), panel
item, dan widget Ringkasan baru "Stok kritis" (M) menggantikan widget lama. Item Perlu ditambah
dan Memakai buffer masuk "Perlu perhatian". Jalankan typecheck, preview:build, lint, inspect.
```

---

## Urutan kerja yang disarankan

1. Konfirmasi sub-menu dan KPI (DESIGN.md §11) dengan manajemen.
2. Stitch A0 → A1. Review A1 bersama pengguna sebelum lanjut, karena semua layar mewarisinya.
3. Stitch A2–A8.
4. Perbarui DESIGN.md dengan keputusan dari review (DESIGN.md adalah sumber, bukan Stitch).
5. Agent B1, lalu B2 per modul.

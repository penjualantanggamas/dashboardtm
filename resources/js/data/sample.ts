// DATA CONTOH — ganti dengan data asli dari Laravel (lihat README "Mengganti data contoh").
// Semua total dihitung dari baris; tidak ada total yang diketik terpisah.
// Waktu acuan: Senin, 26 Okt 2026, WIB.
import type { Alert, DaySales, Line, Quota, Ship, Sku } from './types';

export const TODAY = '2026-10-26';
export const TODAY_DAY = 26;
export const PERIOD_LABEL = '1–26 Okt 2026';

// ---------- Penjualan (juta rupiah) ----------
export const MONTH_TARGET = 52_000; // Rp 52,0 M
// Hari kerja Senin–Sabtu. Okt 2026: Minggu = 4, 11, 18, 25 → 27 hari kerja.
const SUNDAYS = new Set([4, 11, 18, 25]);
export const WORKDAYS_IN_MONTH = 31 - SUNDAYS.size;
// Dibulatkan ke 10 jt supaya angka yang tampil (Rp 1,93 M) sama dengan yang dihitung.
export const DAILY_TARGET = Math.round(MONTH_TARGET / WORKDAYS_IN_MONTH / 10) * 10; // 1.930 jt

// Penjualan harian 1–25 Okt (hari kerja). 19 Okt = Senin lalu (pembanding "hari ini").
const PAST: Record<number, number> = {
    1: 1742, 2: 1991, 3: 1604,
    5: 2012, 6: 2037, 7: 1876, 8: 1903, 9: 2044, 10: 1581,
    12: 1997, 13: 1962, 14: 1820, 15: 1968, 16: 2105, 17: 1622,
    19: 1710, 20: 1914, 21: 2058, 22: 1847, 23: 1936, 24: 1631,
};
export const TODAY_SALES_AT_OPEN = 1840; // Rp 1,84 M per 18:15 WIB; bertambah lewat simulasi live
export const LAST_MONDAY_SALES = PAST[19];
export const SEP_SAME_PERIOD = 38_600; // 1–26 Sep 2026

export function dailySales(todayValue: number): DaySales[] {
    return Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const workday = !SUNDAYS.has(day);
        let value: number | null = null;
        if (day < TODAY_DAY) value = workday ? PAST[day] : 0;
        if (day === TODAY_DAY) value = todayValue;
        return { day, value, workday };
    });
}
export const monthToDate = (todayValue: number) =>
    dailySales(todayValue).reduce((s, d) => s + (d.value ?? 0), 0);

console.assert(monthToDate(TODAY_SALES_AT_OPEN) === 41_200, 'Penjualan 1–26 Okt harus Rp 41,2 M');

// Penjualan per area dan pelanggan, 1–26 Okt, saat buka (juta rupiah)
export const AREAS = [
    { name: 'Jabodetabek', value: 19_420 },
    { name: 'Jawa Timur', value: 11_860 },
    { name: 'Jawa Tengah & DIY', value: 5_730 },
    { name: 'Sumatera Utara', value: 4_190 },
];
console.assert(AREAS.reduce((s, a) => s + a.value, 0) === 41_200, 'Area harus berjumlah Rp 41,2 M');

export const CUSTOMERS = [
    { name: 'PT Sinar Kemasindo', area: 'Jabodetabek', value: 4_820 },
    { name: 'CV Mitra Plastik Jaya', area: 'Jawa Timur', value: 3_610 },
    { name: 'PT Graha Packaging', area: 'Jabodetabek', value: 3_140 },
    { name: 'PT Duta Flexindo', area: 'Jawa Tengah & DIY', value: 2_480 },
    { name: 'UD Sumber Rejeki', area: 'Sumatera Utara', value: 1_960 },
];
export const CUSTOMERS_OTHER = 41_200 - CUSTOMERS.reduce((s, c) => s + c.value, 0); // 214 pelanggan lain
export const CUSTOMER_COUNT = 219;

// ---------- Produksi ----------
export const LINES: Line[] = [
    { id: 'l1', name: 'Lini 1 (Ekstrusi)', output: 124, plan: 130, downtimeMin: 25 },
    { id: 'l2', name: 'Lini 2 (Pencetakan)', output: 118, plan: 120, downtimeMin: 10 },
    { id: 'l3', name: 'Lini 3 (Laminasi)', output: 78, plan: 105, downtimeMin: 160 },
    { id: 'l4', name: 'Lini 4 (Finishing)', output: 92, plan: 95, downtimeMin: 15 },
];
export const OUTPUT_TODAY = LINES.reduce((s, l) => s + l.output, 0);
export const PLAN_TODAY = LINES.reduce((s, l) => s + l.plan, 0);
console.assert(OUTPUT_TODAY === 412 && PLAN_TODAY === 450, 'Output 412 t dari rencana 450 t');

// ---------- Impor ----------
export const SHIPS: Ship[] = [
    { id: 's1', name: 'MV Kirana Jaya', commodity: 'Resin PP', load: 900, origin: 'Busan', departed: '2026-10-17', etaPlanned: '2026-10-27', etaEstimate: '2026-10-27', port: 'Tanjung Priok' },
    { id: 's2', name: 'MV Ocean Pearl', commodity: 'Baja HRC', load: 1500, origin: 'Shanghai', departed: '2026-10-14', etaPlanned: '2026-10-24', etaEstimate: '2026-10-29', port: 'Tanjung Priok' },
    { id: 's3', name: 'MV Han Sung', commodity: 'Baja HRC', load: 1400, origin: 'Incheon', departed: '2026-10-20', etaPlanned: '2026-10-31', etaEstimate: '2026-10-31', port: 'Tanjung Priok' },
    { id: 's4', name: 'MV Nordic Bay', commodity: 'Kertas kraft', load: 1200, origin: 'Gothenburg', departed: '2026-09-28', etaPlanned: '2026-11-02', etaEstimate: '2026-11-04', port: 'Tanjung Priok' },
    { id: 's5', name: 'MV Bintang Selatan', commodity: 'Resin PP', load: 740, origin: 'Kaohsiung', departed: '2026-10-28', etaPlanned: '2026-11-08', etaEstimate: '2026-11-08', port: 'Tanjung Priok' },
];
const QUOTA_BASE = [
    { id: 'pp', commodity: 'Resin PP', quota: 18_000, realised: 14_200 },
    { id: 'hrc', commodity: 'Baja HRC', quota: 24_000, realised: 11_300 },
    { id: 'kraft', commodity: 'Kertas kraft', quota: 9_000, realised: 6_150 },
];
export const QUOTAS: Quota[] = QUOTA_BASE.map((q) => ({
    ...q,
    inTransit: SHIPS.filter((s) => s.commodity === q.commodity).reduce((s, x) => s + x.load, 0),
}));
export const remaining = (q: Quota) => q.quota - q.realised - q.inTransit;
export const remainingPct = (q: Quota) => (remaining(q) / q.quota) * 100;

console.assert(SHIPS.reduce((s, x) => s + x.load, 0) === 5_740, 'Muatan 5 kapal = 5.740 t');
console.assert(remaining(QUOTAS[0]) === 2_160 && remaining(QUOTAS[1]) === 9_800 && remaining(QUOTAS[2]) === 1_650, 'Sisa kuota');

export const daysLate = (s: Ship) =>
    Math.round((Date.parse(s.etaEstimate) - Date.parse(s.etaPlanned)) / 86_400_000);
export const LATE_SHIPS = SHIPS.filter((s) => daysLate(s) > 0);

// Realisasi kumulatif Resin PP per akhir bulan, Jan–Okt (Okt = s.d. 26 Okt), ton.
export const PP_CUMULATIVE = [1_310, 2_780, 4_250, 5_620, 7_160, 8_590, 10_010, 11_480, 12_890, 14_200];
// Laju rata-rata komitmen baru = realisasi / bulan berjalan (9,85 bulan s.d. 26 Okt)
export const PP_RATE_PER_MONTH = Math.round(14_200 / (9 + 26 / 31)); // ≈ 1.443 t/bulan
// Sisa yang belum terikat habis setelah: sisa / laju (bulan) sejak 26 Okt
export const PP_EXHAUST_DAYS = Math.round((remaining(QUOTAS[0]) / PP_RATE_PER_MONTH) * 30.4);
export const PP_EXHAUST_DATE = new Date(Date.parse(TODAY) + PP_EXHAUST_DAYS * 86_400_000);

export const IMPORT_VALUE = { thisMonth: 18_640, lastMonthSamePeriod: 21_350 }; // juta rupiah
export const HELD_DOCS = [
    { id: 'PIB-260117', ship: 'MV Ocean Pearl', issue: 'Menunggu SPPB', since: '2026-10-22' },
    { id: 'PIB-260121', ship: 'MV Kirana Jaya', issue: 'Revisi HS code', since: '2026-10-24' },
    { id: 'PIB-260098', ship: 'MV Selat Mas', issue: 'Jalur merah, pemeriksaan fisik', since: '2026-10-20' },
];
export const QUOTA_HISTORY = [
    { pib: 'PIB-260112', date: '2026-10-21', commodity: 'Resin PP', ship: 'MV Selat Mas', volume: 1_150 },
    { pib: 'PIB-260104', date: '2026-10-15', commodity: 'Baja HRC', ship: 'MV Golden Crane', volume: 2_200 },
    { pib: 'PIB-260096', date: '2026-10-09', commodity: 'Kertas kraft', ship: 'MV Baltic Star', volume: 950 },
    { pib: 'PIB-260089', date: '2026-10-03', commodity: 'Resin PP', ship: 'MV Kirana Jaya', volume: 880 },
    { pib: 'PIB-260077', date: '2026-09-26', commodity: 'Baja HRC', ship: 'MV Han Sung', volume: 1_600 },
];

// ---------- Gudang ----------
export const WAREHOUSES = ['Gudang Cikarang', 'Gudang Surabaya', 'Gudang Medan'];
export const BRANCHES = ['Jakarta', 'Surabaya', 'Medan'];

// 1.284 SKU dibangkitkan deterministik; 7 di bawah minimum; total nilai Rp 128,4 M.
function rng(seed: number) {
    return () => ((seed = (seed * 1_664_525 + 1_013_904_223) >>> 0) / 2 ** 32);
}
const ITEMS = [
    ['Resin PP homopolimer', 'kg'], ['Resin PE LLDPE', 'kg'], ['Film BOPP 20 mic', 'roll'], ['Film CPP 25 mic', 'roll'],
    ['Kertas kraft 80 gsm', 'roll'], ['Tinta flexo cyan', 'kg'], ['Tinta flexo magenta', 'kg'], ['Adhesive laminasi', 'kg'],
    ['Inti kertas 3 inci', 'pcs'], ['Kantong standing pouch', 'pcs'], ['Plat baja HRC 2 mm', 'kg'], ['Masterbatch putih', 'kg'],
] as const;
const CRITICAL = new Set([17, 203, 388, 512, 777, 940, 1166]);
function buildSkus(): Sku[] {
    const r = rng(2026);
    const rows: Sku[] = [];
    for (let i = 0; i < 1_284; i++) {
        const [base, unit] = ITEMS[i % ITEMS.length];
        const minimum = Math.round((unit === 'pcs' ? 2_000 : unit === 'roll' ? 40 : 800) * (0.6 + r()));
        const dailyUse = Math.max(1, Math.round(minimum / (5 + r() * 6)));
        const stock = CRITICAL.has(i)
            ? Math.round(minimum * (0.35 + r() * 0.5))
            : Math.round(minimum * (1.15 + r() * 3));
        rows.push({
            code: `SKU-${String(10_000 + i * 7).padStart(5, '0')}`,
            name: `${base} ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
            warehouse: WAREHOUSES[i % 3],
            unit,
            stock,
            minimum,
            dailyUse,
            value: 0,
        });
    }
    // Nilai: bobot acak, diskalakan supaya total tepat Rp 128,4 M (dalam juta, 1 desimal)
    const weights = rows.map(() => 0.3 + r());
    const wsum = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    rows.forEach((row, i) => {
        row.value = Math.round((weights[i] / wsum) * 128_400 * 10) / 10;
        acc += row.value;
    });
    rows[rows.length - 1].value = Math.round((rows[rows.length - 1].value + 128_400 - acc) * 10) / 10;
    return rows;
}
export const SKUS = buildSkus();
export const SKU_VALUE_TOTAL = Math.round(SKUS.reduce((s, x) => s + x.value, 0) * 10) / 10;
export const SKUS_BELOW_MIN = SKUS.filter((s) => s.stock < s.minimum);
console.assert(SKUS.length === 1_284 && SKUS_BELOW_MIN.length === 7 && SKU_VALUE_TOTAL === 128_400, 'Gudang');
export const STOCK_BY_WAREHOUSE = WAREHOUSES.map((w) => ({
    name: w,
    value: Math.round(SKUS.filter((s) => s.warehouse === w).reduce((a, s) => a + s.value, 0) * 10) / 10,
}));

// ---------- Perlu perhatian ----------
export function buildAlerts(todaySales: number): Alert[] {
    const pp = QUOTAS[0];
    const pct = (todaySales / DAILY_TARGET) * 100;
    const fmt1 = (n: number) => n.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const late = [...LATE_SHIPS].sort((a, b) => daysLate(b) - daysLate(a));
    const l3 = LINES[2];
    const list: Alert[] = [
        { id: 'a1', severity: 'kritis', text: `Kuota ${pp.commodity} tersisa ${fmt1(remainingPct(pp))}%`, module: 'impor', href: '/impor/kuota' },
        { id: 'a2', severity: 'kritis', text: `${late[0].name} terlambat ${daysLate(late[0])} hari`, module: 'impor', href: '/impor/jadwal-kapal' },
        { id: 'a3', severity: 'perhatian', text: `${SKUS_BELOW_MIN.length} SKU di bawah minimum`, module: 'gudang', href: '/gudang/posisi-stok?status=minimum' },
        { id: 'a4', severity: 'perhatian', text: `${l3.name.split(' (')[0]} downtime ${Math.floor(l3.downtimeMin / 60)} j ${l3.downtimeMin % 60} m hari ini`, module: 'produksi', href: '/produksi/oee' },
    ];
    if (pct < 100)
        list.push({ id: 'a5', severity: 'perhatian', text: `Penjualan hari ini ${fmt1(pct)}% dari target`, module: 'penjualan', href: '/penjualan/target' });
    list.push({ id: 'a6', severity: 'perhatian', text: `${late[1].name} terlambat ${daysLate(late[1])} hari`, module: 'impor', href: '/impor/jadwal-kapal' });
    return list;
}

// Katalog widget Ringkasan (DESIGN.md §11). Setiap sub-menu menyumbang widget ke sini.
// Menambah widget: tambahkan entri di WIDGETS + komponennya di bawah.
import type { ReactNode } from 'react';
import { AppLink } from '@/components/AppLink';
import { DailySalesChart, PlanBars, QuotaLegend, QuotaTracks, ShipLanes, Thumb } from '@/components/Charts';
import { Card, Flash, SeverityPill, type MenuItem } from '@/components/UI';
import {
    AREAS, buildAlerts, CUSTOMERS, CUSTOMER_COUNT, DAILY_TARGET, dailySales, daysLate, HELD_DOCS, IMPORT_VALUE,
    LAST_MONDAY_SALES, LATE_SHIPS, PP_EXHAUST_DATE, LINES, MONTH_TARGET, monthToDate, OUTPUT_TODAY, PLAN_TODAY, QUOTAS, SEP_SAME_PERIOD,
    SHIPS, SKUS, SKUS_BELOW_MIN, TODAY, TODAY_DAY, WAREHOUSES,
} from '@/data/sample';
import type { ModuleId } from '@/data/types';
import { dayMonth, fullDate, hm, num, pct, rp, rpParts, signed, MINUS } from '@/lib/format';
import { useFilters, useLive } from '@/lib/store';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'Full';
export const SIZES: Size[] = ['S', 'M', 'L', 'XL', 'Full'];
export type WidgetId =
    | 'kpi' | 'penjualan' | 'perhatian' | 'kuota' | 'output' | 'kapal' | 'jalur'
    | 'stokKritis' | 'nilaiGudang' | 'topPelanggan' | 'area' | 'nilaiImpor' | 'dokumen';

export interface WidgetDef {
    id: WidgetId;
    title: string;
    module: ModuleId | 'ringkasan';
    desc: string;
    size: Size;
    sizes: Size[];
    thumb: Parameters<typeof Thumb>[0]['kind'];
    locked?: boolean;
    href: string;
    Body: (p: { size: Size }) => ReactNode;
}

export interface LayoutItem { id: WidgetId; size: Size }

// Filter halaman ikut terbawa saat drill-down (DESIGN.md §2).
export function useDrill() {
    const f = useFilters();
    return (href: string) => {
        const q = new URLSearchParams();
        if (f.branch !== 'Semua cabang') q.set('cabang', f.branch);
        if (f.warehouse !== 'Semua gudang') q.set('gudang', f.warehouse);
        const s = q.toString();
        return s ? `${href}${href.includes('?') ? '&' : '?'}${s}` : href;
    };
}

const baseMenu = (href: string, extra: MenuItem[] = []): MenuItem[] => [
    { label: 'Lihat detail', icon: 'chevronRight', href },
    ...extra,
];

// ---------- Widget ----------
function KpiStrip() {
    const { todaySales, changed } = useLive();
    const f = useFilters();
    const drill = useDrill();
    const critical = SKUS_BELOW_MIN.filter((s) => f.warehouse === 'Semua gudang' || s.warehouse === f.warehouse).length;
    const skuCount = SKUS.filter((s) => f.warehouse === 'Semua gudang' || s.warehouse === f.warehouse).length;
    const sales = rpParts(todaySales);
    const vsMonday = ((todaySales - LAST_MONDAY_SALES) / LAST_MONDAY_SALES) * 100;
    const cells = [
        { label: 'Penjualan hari ini', href: '/penjualan/target', value: <><Flash watch={changed}>Rp {sales.value}</Flash><span className="unit">{sales.unit}</span></>, money: true,
            cap: <>{pct((todaySales / DAILY_TARGET) * 100)} dari target {rp(DAILY_TARGET)}</>, title: `${signed(vsMonday, (v) => pct(v))} vs Senin lalu (${rp(LAST_MONDAY_SALES)})` },
        { label: 'Output produksi hari ini', href: '/produksi/rencana', value: <>{num(OUTPUT_TODAY)}<span className="unit">t</span></>,
            cap: <>{pct((OUTPUT_TODAY / PLAN_TODAY) * 100)} dari rencana {num(PLAN_TODAY)} t</> },
        { label: 'Stok di bawah minimum', href: '/gudang/posisi-stok?status=minimum', value: <>{num(critical)}<span className="unit">SKU</span></>,
            cap: <>dari {num(skuCount)} SKU aktif</> },
        { label: 'Kapal dalam perjalanan', href: '/impor/jadwal-kapal', value: <>{SHIPS.length}</>,
            cap: <><span className="neg">{LATE_SHIPS.length} terlambat</span> dari ETA awal</> },
    ];
    return (
        <>
            {cells.map((c) => (
                <AppLink key={c.label} href={drill(c.href)} className="kpi" title={'title' in c ? String(c.title) : undefined}>
                    <div className="kpi-label">{c.label}</div>
                    <div className={`kpi-value${c.money ? ' money' : ''}`}>{c.value}</div>
                    <div className="kpi-cap num">{c.cap}</div>
                </AppLink>
            ))}
        </>
    );
}

function PenjualanBody() {
    const { todaySales } = useLive();
    const mtd = monthToDate(todaySales);
    const vsSep = ((mtd - SEP_SAME_PERIOD) / SEP_SAME_PERIOD) * 100;
    return (
        <>
            <div className="lead-figure" style={{ marginBottom: 12 }}>
                <span className="big">{rp(mtd)}</span>
                <span className="sub num">{pct((mtd / MONTH_TARGET) * 100)} dari target {rp(MONTH_TARGET)}</span>
                <span className="num pos">{signed(vsSep, (v) => pct(v))} vs 1–26 Sep</span>
            </div>
            <DailySalesChart days={dailySales(todaySales)} target={DAILY_TARGET} today={TODAY_DAY} />
        </>
    );
}

function PerhatianBody() {
    const { todaySales } = useLive();
    const drill = useDrill();
    const alerts = buildAlerts(todaySales);
    return (
        <ul className="rows">
            {alerts.slice(0, 5).map((a) => (
                <li key={a.id}>
                    <AppLink href={drill(a.href)} className="row-link alert-row">
                        <SeverityPill s={a.severity} />
                        <span className="row-main">{a.text}</span>
                        <span className="row-mod">{a.module[0].toUpperCase() + a.module.slice(1)}</span>
                    </AppLink>
                </li>
            ))}
        </ul>
    );
}

function KapalBody() {
    const list = [...SHIPS].sort((a, b) => a.etaEstimate.localeCompare(b.etaEstimate));
    return (
        <ul className="rows">
            {list.map((s) => {
                const late = daysLate(s);
                return (
                    <li key={s.id}>
                        <div className="row-link ship-row">
                            <span>
                                <span className="row-main" style={{ fontWeight: 500 }}>{s.name}</span>
                                <span className="row-sub" style={{ display: 'block' }}>{s.commodity} · tiba {dayMonth(s.etaEstimate)}</span>
                            </span>
                            <span className={`pill ${late > 0 ? 'pill-neg' : 'pill-pos'}`}>{late > 0 ? `Terlambat ${late} hari` : 'Tepat waktu'}</span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function StokKritisBody() {
    const f = useFilters();
    const list = SKUS_BELOW_MIN.filter((s) => f.warehouse === 'Semua gudang' || s.warehouse === f.warehouse)
        .sort((a, b) => a.stock / a.dailyUse - b.stock / b.dailyUse);
    if (!list.length) return <p className="state-empty">Tidak ada SKU di bawah minimum di {f.warehouse}.</p>;
    return (
        <table className="data">
            <thead><tr><th>Barang</th><th className="r">Stok</th><th className="r">Cakupan</th></tr></thead>
            <tbody>
                {list.slice(0, 5).map((s) => (
                    <tr key={s.code}>
                        <td style={{ maxWidth: 0, width: '60%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</td>
                        <td className="r neg">{num(s.stock)} <span className="muted">{s.unit}</span></td>
                        <td className="r">{Math.floor(s.stock / s.dailyUse)} hari</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function BarList({ rows, format }: { rows: { name: string; value: number; sub?: string }[]; format: (v: number) => string }) {
    const max = Math.max(...rows.map((r) => r.value));
    return (
        <ul className="rows">
            {rows.map((r, i) => (
                <li key={r.name} style={{ padding: '9px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}{r.sub && <span className="muted"> · {r.sub}</span>}</span>
                        <span className="num" style={{ fontWeight: i === 0 ? 500 : 400 }}>{format(r.value)}</span>
                    </div>
                    <div style={{ height: 2, marginTop: 6, background: i === 0 ? 'var(--chart-1)' : 'var(--chart-2)', width: `${(r.value / max) * 88}%` }} />
                </li>
            ))}
        </ul>
    );
}

function NilaiImporBody() {
    const d = ((IMPORT_VALUE.thisMonth - IMPORT_VALUE.lastMonthSamePeriod) / IMPORT_VALUE.lastMonthSamePeriod) * 100;
    return (
        <div>
            <div className="kpi-value money" style={{ marginTop: 0 }}>{rp(IMPORT_VALUE.thisMonth)}</div>
            <div className="kpi-cap num">{signed(d, (v) => pct(v))} vs 1–26 Sep ({rp(IMPORT_VALUE.lastMonthSamePeriod)})</div>
        </div>
    );
}

function DokumenBody() {
    return (
        <ul className="rows">
            {HELD_DOCS.map((d) => (
                <li key={d.id}>
                    <div className="row-link ship-row">
                        <span>
                            <span className="row-main mono">{d.id}</span>
                            <span className="row-sub" style={{ display: 'block' }}>{d.ship} · {d.issue}</span>
                        </span>
                        <span className="muted num" style={{ fontSize: 12 }}>sejak {dayMonth(d.since)}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export const WIDGETS: Record<WidgetId, WidgetDef> = {
    kpi: { id: 'kpi', title: 'KPI Ringkasan', module: 'ringkasan', desc: 'Empat angka utama hari ini.', size: 'Full', sizes: ['Full'], thumb: 'kpi', locked: true, href: '/ringkasan', Body: KpiStrip },
    penjualan: { id: 'penjualan', title: 'Penjualan Oktober', module: 'penjualan', desc: 'Penjualan harian bulan ini terhadap target harian.', size: 'XL', sizes: ['L', 'XL', 'Full'], thumb: 'bars', href: '/penjualan/laporan', Body: PenjualanBody },
    perhatian: { id: 'perhatian', title: 'Perlu perhatian', module: 'ringkasan', desc: 'Hal yang butuh keputusan, dari semua modul.', size: 'M', sizes: ['M', 'L'], thumb: 'list', locked: true, href: '/ringkasan', Body: PerhatianBody },
    kuota: { id: 'kuota', title: 'Sisa kuota impor 2026', module: 'impor', desc: 'Kuota terpakai, berlayar, dan sisa per komoditas.', size: 'M', sizes: ['M', 'L'], thumb: 'tracks', href: '/impor/kuota', Body: () => <><QuotaTracks quotas={QUOTAS} /><div style={{ marginTop: 16 }}><QuotaLegend /></div><p style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--rule)' }}>Pada laju saat ini, sisa {QUOTAS[0].commodity} habis sekitar <strong style={{ fontWeight: 500 }}>{fullDate(PP_EXHAUST_DATE)}</strong>.</p></> },
    output: { id: 'output', title: 'Output vs rencana per lini', module: 'produksi', desc: 'Output hari ini tiap lini terhadap rencananya.', size: 'M', sizes: ['M', 'L'], thumb: 'tracks', href: '/produksi/rencana', Body: () => <><PlanBars rows={LINES.map((l) => ({ label: l.name, value: l.output, plan: l.plan, sub: <span className={l.downtimeMin >= 60 ? 'neg' : undefined}>Downtime {l.downtimeMin >= 60 ? hm(l.downtimeMin) : `${l.downtimeMin} m`}</span> }))} /><div className="legend" style={{ marginTop: 14 }}><span><i style={{ background: 'var(--chart-2)' }} />Output hari ini</span><span><i style={{ width: 2, height: 12, background: 'var(--chart-1)' }} />Rencana</span></div></> },
    kapal: { id: 'kapal', title: 'Kapal 14 hari ke depan', module: 'impor', desc: 'Kapal yang akan tiba dan statusnya.', size: 'M', sizes: ['M', 'L'], thumb: 'list', href: '/impor/jadwal-kapal', Body: KapalBody },
    jalur: { id: 'jalur', title: 'Jalur kedatangan kapal', module: 'impor', desc: 'Kapal 14 hari ke depan pada sumbu tanggal.', size: 'XL', sizes: ['XL', 'Full'], thumb: 'lanes', href: '/impor/jadwal-kapal', Body: () => <ShipLanes ships={SHIPS} from="2026-10-24" to="2026-11-09" today={TODAY} compact /> },
    stokKritis: { id: 'stokKritis', title: 'Stok kritis', module: 'gudang', desc: 'SKU di bawah minimum, cakupan tersingkat dulu.', size: 'M', sizes: ['M', 'L'], thumb: 'list', href: '/gudang/posisi-stok?status=minimum', Body: StokKritisBody },
    nilaiGudang: { id: 'nilaiGudang', title: 'Nilai stok per gudang', module: 'gudang', desc: 'Nilai persediaan di tiap gudang.', size: 'M', sizes: ['S', 'M', 'L'], thumb: 'list', href: '/gudang/posisi-stok',
        Body: () => <BarList rows={WAREHOUSES.map((w) => ({ name: w, value: SKUS.filter((s) => s.warehouse === w).reduce((a, s) => a + s.value, 0) })).sort((a, b) => b.value - a.value)} format={rp} /> },
    topPelanggan: { id: 'topPelanggan', title: 'Top 5 pelanggan', module: 'penjualan', desc: `Pelanggan terbesar bulan ini dari ${CUSTOMER_COUNT}.`, size: 'M', sizes: ['M', 'L'], thumb: 'list', href: '/penjualan/pelanggan',
        Body: () => <BarList rows={CUSTOMERS.map((c) => ({ name: c.name, value: c.value }))} format={rp} /> },
    area: { id: 'area', title: 'Penjualan per area', module: 'penjualan', desc: 'Penjualan bulan ini per wilayah.', size: 'M', sizes: ['M', 'L'], thumb: 'list', href: '/penjualan/pelanggan',
        Body: () => <BarList rows={AREAS} format={rp} /> },
    nilaiImpor: { id: 'nilaiImpor', title: 'Nilai impor bulan ini', module: 'impor', desc: 'Total nilai impor dan perbandingan bulan lalu.', size: 'S', sizes: ['S', 'M'], thumb: 'figure', href: '/impor/laporan', Body: NilaiImporBody },
    dokumen: { id: 'dokumen', title: 'Dokumen tertahan', module: 'impor', desc: 'PIB dan dokumen yang belum selesai.', size: 'M', sizes: ['M', 'L'], thumb: 'list', href: '/impor/dokumen', Body: DokumenBody },
};

// Footer & meta per widget
export function widgetChrome(id: WidgetId, todaySales: number) {
    switch (id) {
        case 'perhatian': return { count: buildAlerts(todaySales).length, foot: <AppLink href="/ringkasan" className="btn btn-outline btn-sm btn-block">Lihat semua ({buildAlerts(todaySales).length})</AppLink> };
        case 'kuota': return { foot: <><span>Sisa per komoditas, % dari kuota</span><AppLink href="/impor/kuota">Lihat kuota</AppLink></> };
        case 'output': return { foot: <><span>Total {num(OUTPUT_TODAY)} t dari {num(PLAN_TODAY)} t</span><AppLink href="/produksi/rencana">Lihat produksi</AppLink></> };
        case 'kapal': return { foot: <><span>{SHIPS.length} kapal · {num(SHIPS.reduce((a, s) => a + s.load, 0))} t</span><span>Tanjung Priok</span></> };
        case 'stokKritis': return { foot: <AppLink href="/gudang/posisi-stok?status=minimum">Lihat semua ({SKUS_BELOW_MIN.length})</AppLink> };
        case 'penjualan': return { meta: '1–26 Okt' };
        case 'dokumen': return { count: HELD_DOCS.length };
        case 'nilaiImpor': return { meta: '1–26 Okt' };
        default: return {};
    }
}

export const DEFAULT_VIEWS: Record<string, { label: string; layout: LayoutItem[] }> = {
    direksi: { label: 'Direksi', layout: [
        { id: 'kpi', size: 'Full' }, { id: 'penjualan', size: 'XL' }, { id: 'perhatian', size: 'M' },
        { id: 'kuota', size: 'M' }, { id: 'output', size: 'M' }, { id: 'kapal', size: 'M' },
    ] },
    impor: { label: 'Manajer Impor', layout: [
        { id: 'kpi', size: 'Full' }, { id: 'jalur', size: 'XL' }, { id: 'perhatian', size: 'M' },
        { id: 'kuota', size: 'M' }, { id: 'dokumen', size: 'M' }, { id: 'kapal', size: 'M' },
    ] },
};

export { baseMenu, MINUS };
export const MODULE_LABEL: Record<WidgetDef['module'], string> = { ringkasan: 'Ringkasan', penjualan: 'Penjualan', gudang: 'Gudang', produksi: 'Produksi', impor: 'Impor' };
export { Card };

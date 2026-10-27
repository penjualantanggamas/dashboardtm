import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Icon } from '@/components/Icon';
import { Card, Select } from '@/components/UI';
import { SKU_VALUE_TOTAL, SKUS, SKUS_BELOW_MIN } from '@/data/sample';
import { num, rp } from '@/lib/format';
import { filters, useFilters, WAREHOUSE_OPTIONS } from '@/lib/store';
import { useQuery } from '@/lib/query';
import AppShell, { PageHead } from '@/layouts/AppShell';

const PAGE = 50;
type Status = 'semua' | 'minimum' | 'berlebih';

export default function PosisiStok() {
    const query = useQuery();
    const f = useFilters();
    const [status, setStatus] = useState<Status>((query.get('status') as Status) || 'semua');
    const [q, setQ] = useState(query.get('q') ?? '');
    const [page, setPage] = useState(0);
    const warehouse = query.get('gudang') && f.warehouse === 'Semua gudang' ? query.get('gudang')! : f.warehouse;

    const scoped = SKUS.filter((s) => warehouse === 'Semua gudang' || s.warehouse === warehouse);
    const counts = {
        semua: scoped.length,
        minimum: scoped.filter((s) => s.stock < s.minimum).length,
        berlebih: scoped.filter((s) => s.stock / s.dailyUse > 30).length,
    };
    const rows = useMemo(() => scoped
        .filter((s) => status === 'semua' || (status === 'minimum' ? s.stock < s.minimum : s.stock / s.dailyUse > 30))
        .filter((s) => !q || `${s.code} ${s.name}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (status === 'minimum' ? a.stock / a.dailyUse - b.stock / b.dailyUse : a.code.localeCompare(b.code))),
    [scoped, status, q]);
    const start = page * PAGE;
    const shown = rows.slice(start, start + PAGE);
    const set = (fn: () => void) => { fn(); setPage(0); };

    return (
        <AppShell>
            <Head title="Posisi Stok" />
            <PageHead
                title="Posisi Stok"
                subline={<>{SKUS_BELOW_MIN.length} dari {num(SKUS.length)} SKU di bawah stok minimum. Nilai stok {rp(SKU_VALUE_TOTAL)}.</>}
                actions={<button className="btn btn-secondary" onClick={() => window.print()}><Icon name="download" />Export</button>}
            />
            <div className="scope">
                <label className="search" style={{ width: 280 }}>
                    <Icon name="search" /><span className="sr-only">Cari SKU</span>
                    <input placeholder="Cari kode atau nama barang" value={q} onChange={(e) => set(() => setQ(e.target.value))} />
                </label>
                <Select label="Gudang" value={warehouse} options={WAREHOUSE_OPTIONS} onChange={(v) => set(() => filters.set({ warehouse: v }))} />
                <div className="seg" role="group" aria-label="Status stok">
                    {([['semua', 'Semua'], ['minimum', 'Di bawah minimum'], ['berlebih', 'Cakupan > 30 hari']] as const).map(([k, l]) => (
                        <button key={k} aria-pressed={status === k} onClick={() => set(() => setStatus(k))}>
                            {l} <span className="num muted">{num(counts[k])}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid">
                <div className="w-Full" style={{ display: 'flex' }}>
                    <Card className="grow" title={`${num(rows.length)} SKU`} skeletonRows={8} empty="Tidak ada SKU di gudang ini.">
                        {rows.length === 0 ? (
                            <p className="state-empty">Tidak ada SKU yang cocok dengan “{q}”{warehouse !== 'Semua gudang' ? ` di ${warehouse}` : ''}.</p>
                        ) : (
                            <>
                                <div className="table-scroll">
                                    <table className="data">
                                        <thead><tr>
                                            <th>Kode SKU</th><th>Nama barang</th><th>Gudang</th>
                                            <th className="r">Stok</th><th className="r">Minimum</th><th className="r">Cakupan</th><th className="r">Nilai</th><th>Status</th>
                                        </tr></thead>
                                        <tbody>
                                            {shown.map((s) => {
                                                const low = s.stock < s.minimum;
                                                return (
                                                    <tr key={s.code}>
                                                        <td className="mono">{s.code}</td>
                                                        <td>{s.name}</td>
                                                        <td>{s.warehouse}</td>
                                                        <td className={`r${low ? ' neg' : ''}`}>{num(s.stock)} <span className="muted">{s.unit}</span></td>
                                                        <td className="r">{num(s.minimum)} <span className="muted">{s.unit}</span></td>
                                                        <td className="r">{Math.floor(s.stock / s.dailyUse)} hari</td>
                                                        <td className="r">{rp(s.value)}</td>
                                                        <td>{low ? <span className="pill pill-neg">Di bawah minimum</span> : <span className="dash" aria-label="Normal">–</span>}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="pager num">
                                    <span>{num(start + 1)}–{num(Math.min(start + PAGE, rows.length))} dari {num(rows.length)}</span>
                                    <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Sebelumnya</button>
                                    <button className="btn btn-outline btn-sm" disabled={start + PAGE >= rows.length} onClick={() => setPage(page + 1)}>Berikutnya</button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}

import { Head } from '@inertiajs/react';
import { useMemo, useState, type DragEvent } from 'react';
import { AppLink } from '@/components/AppLink';
import { Thumb } from '@/components/Charts';
import { Icon } from '@/components/Icon';
import { Card, Select, useOutside } from '@/components/UI';
import { ExportMenu } from '@/components/ExportMenu';
import { buildAlerts, LATE_SHIPS, PERIOD_LABEL, QUOTAS, remainingPct } from '@/data/sample';
import { pct } from '@/lib/format';
import { BRANCH_OPTIONS, filters, load, readSim, save, useFilters, useLive, WAREHOUSE_OPTIONS } from '@/lib/store';
import AppShell, { PageHead } from '@/layouts/AppShell';
import {
    baseMenu, DEFAULT_VIEWS, MODULE_LABEL, SIZES, useDrill, widgetChrome, WIDGETS,
    type LayoutItem, type Size, type WidgetId,
} from '@/widgets/registry';

const STORE_KEY = 'dtm-ringkasan-v1';
type Saved = { view: string; layouts: Record<string, LayoutItem[]> };

export default function Ringkasan() {
    const [saved, setSaved] = useState<Saved>(() => load<Saved>(STORE_KEY, { view: 'direksi', layouts: {} }));
    const view = DEFAULT_VIEWS[saved.view] ? saved.view : 'direksi';
    const layout = saved.layouts[view] ?? DEFAULT_VIEWS[view].layout;
    const [draft, setDraft] = useState<LayoutItem[] | null>(null);
    const [sheet, setSheet] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const editing = draft !== null;
    const items = draft ?? layout;
    const dirty = editing && JSON.stringify(draft) !== JSON.stringify(layout);

    const persist = (next: Saved) => { setSaved(next); save(STORE_KEY, next); };
    const finishEdit = () => { setDraft(null); setSheet(false); setConfirm(false); };

    const { todaySales } = useLive();
    const pp = QUOTAS[0];
    const subline = (
        <>{LATE_SHIPS.length} kapal terlambat dan kuota {pp.commodity} tersisa {pct(remainingPct(pp))}. Keduanya perlu keputusan minggu ini.</>
    );

    return (
        <AppShell>
            <Head title="Ringkasan" />
            <div className={editing ? 'editing' : undefined}>
                {editing ? (
                    <PageHead
                        title="Ringkasan"
                        subline={<>Mengatur tampilan <strong>{DEFAULT_VIEWS[view].label}</strong>. Seret kartu untuk memindahkan. Perubahan hanya untuk tampilan Anda.</>}
                        actions={<>
                            <button className="btn btn-outline" onClick={() => setSheet(true)}><Icon name="plus" />Tambah widget</button>
                            <button className="btn btn-text" onClick={() => setDraft(DEFAULT_VIEWS[view].layout)}>Reset ke default</button>
                            <button className="btn btn-secondary" onClick={() => (dirty ? setConfirm(true) : finishEdit())}>Batal</button>
                            <button className="btn btn-primary" onClick={() => { persist({ ...saved, layouts: { ...saved.layouts, [view]: draft! } }); finishEdit(); }}>Simpan</button>
                        </>}
                    />
                ) : (
                    <PageHead
                        title="Ringkasan"
                        subline={subline}
                        actions={<>
                            <Select label="Tampilan" value={DEFAULT_VIEWS[view].label} options={Object.values(DEFAULT_VIEWS).map((v) => v.label)}
                                onChange={(label) => persist({ ...saved, view: Object.keys(DEFAULT_VIEWS).find((k) => DEFAULT_VIEWS[k].label === label)! })} />
                            <button className="btn btn-secondary hide-sm" onClick={() => setDraft(layout)}>Atur tampilan</button>
                            <ExportMenu data={() => ({ name: 'ringkasan-perlu-perhatian', rows: [['Tingkat', 'Hal', 'Modul'], ...buildAlerts(todaySales).map((a) => [a.severity, a.text, a.module])] })} />
                        </>}
                    />
                )}
                <ScopeRow />
                <Grid items={items} editing={editing} onChange={setDraft} />
            </div>
            {sheet && draft && (
                <AddWidgetSheet
                    present={draft.map((d) => d.id)}
                    onAdd={(id) => setDraft([...draft, { id, size: WIDGETS[id].size }])}
                    onClose={() => setSheet(false)}
                />
            )}
            {confirm && (
                <>
                    <div className="scrim" />
                    <div className="dialog" role="alertdialog" aria-labelledby="dlg-t">
                        <h2 id="dlg-t">Buang perubahan tampilan?</h2>
                        <p>Susunan widget kembali seperti terakhir disimpan.</p>
                        <div className="actions">
                            <button className="btn btn-secondary" onClick={() => setConfirm(false)}>Lanjut mengatur</button>
                            <button className="btn btn-primary" onClick={finishEdit}>Buang perubahan</button>
                        </div>
                    </div>
                </>
            )}
        </AppShell>
    );
}

function ScopeRow() {
    const f = useFilters();
    const [open, setOpen] = useState(false);
    const ref = useOutside<HTMLDivElement>(open, () => setOpen(false));
    return (
        <>
            <div className="scope">
                <div ref={ref} style={{ position: 'relative' }}>
                    <button className="btn btn-outline num" aria-expanded={open} onClick={() => setOpen(!open)}>
                        <Icon name="calendar" />{PERIOD_LABEL}<Icon name="chevronDown" size={14} />
                    </button>
                    {open && (
                        <div className="menu" style={{ left: 0, top: 40 }}>
                            <button onClick={() => setOpen(false)} aria-pressed="true"><strong style={{ fontWeight: 500 }}>Bulan ini</strong><span className="muted num" style={{ marginLeft: 'auto' }}>{PERIOD_LABEL}</span></button>
                            <hr />
                            <p className="muted" style={{ padding: '6px 10px', fontSize: 12, maxWidth: 240 }}>Hari ini, 7 hari, dan Kuartal ini aktif setelah data asli tersambung.</p>
                        </div>
                    )}
                </div>
                <Select label="Cabang" value={f.branch} options={BRANCH_OPTIONS} onChange={(v) => filters.set({ branch: v })} />
                <Select label="Gudang" value={f.warehouse} options={WAREHOUSE_OPTIONS} onChange={(v) => filters.set({ warehouse: v })} />
            </div>
            {f.branch !== 'Semua cabang' && (
                <div className="notice" role="status">Data contoh hanya tersedia untuk semua cabang. Filter {f.branch} aktif setelah data asli tersambung.</div>
            )}
        </>
    );
}

function Grid({ items, editing, onChange }: { items: LayoutItem[]; editing: boolean; onChange: (l: LayoutItem[]) => void }) {
    const [drag, setDrag] = useState<number | null>(null);
    const [over, setOver] = useState<number | null>(null);
    const { todaySales } = useLive();
    const drill = useDrill();
    const move = (from: number, to: number) => {
        if (from === to || to < 0 || to >= items.length) return;
        const next = [...items];
        const [x] = next.splice(from, 1);
        next.splice(to, 0, x);
        onChange(next);
    };
    return (
        <div className="grid-host">
            {editing && <div className="grid-guides" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>}
            <div className="grid">
                {items.map((it, i) => {
                    const w = WIDGETS[it.id];
                    const chrome = widgetChrome(it.id, todaySales);
                    const bar = editing && (
                        <EditBar
                            title={w.title}
                            size={it.size}
                            sizes={w.sizes}
                            locked={!!w.locked}
                            onSize={(s) => onChange(items.map((x, j) => (j === i ? { ...x, size: s } : x)))}
                            onRemove={() => onChange(items.filter((_, j) => j !== i))}
                            onMove={(d) => move(i, i + d)}
                            onDragStart={(e) => { setDrag(i); e.dataTransfer.effectAllowed = 'move'; }}
                            onDragEnd={() => { setDrag(null); setOver(null); }}
                        />
                    );
                    const dnd = editing ? {
                        onDragOver: (e: DragEvent) => { e.preventDefault(); setOver(i); },
                        onDrop: (e: DragEvent) => { e.preventDefault(); if (drag !== null) move(drag, i); setDrag(null); setOver(null); },
                    } : {};
                    const cls = `w-${it.size}${drag === i ? ' dragging' : ''}${over === i && drag !== i ? ' drop-target' : ''}`;
                    if (it.id === 'kpi') {
                        return (
                            <section key={it.id} className={`card kpis order-kpi ${cls}`} aria-label="KPI Ringkasan" {...dnd}>
                                {bar}
                                {readSim() === 'loading'
                                    ? Array.from({ length: 4 }, (_, k) => <div key={k} className="kpi"><span className="skel" style={{ width: 110, height: 12 }} /><div style={{ marginTop: 12 }}><span className="skel" style={{ width: 90, height: 24 }} /></div></div>)
                                    : <w.Body size={it.size} />}
                            </section>
                        );
                    }
                    return (
                        <div key={it.id} className={`${cls}${it.id === 'perhatian' ? ' order-alert' : ''}`} style={{ display: 'flex' }} {...dnd}>
                            <Card
                                className="grow"
                                title={w.title}
                                href={editing ? undefined : drill(w.href)}
                                meta={chrome.meta}
                                count={chrome.count}
                                foot={chrome.foot}
                                menu={editing ? undefined : baseMenu(drill(w.href))}
                                headExtra={bar}
                                empty={`Belum ada data ${w.title.toLowerCase()} untuk periode ini.`}
                            >
                                <w.Body size={it.size} />
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function EditBar(p: {
    title: string; size: Size; sizes: Size[]; locked: boolean;
    onSize: (s: Size) => void; onRemove: () => void; onMove: (d: number) => void;
    onDragStart: (e: DragEvent) => void; onDragEnd: () => void;
}) {
    return (
        <div className="edit-bar">
            <span className="handle" draggable onDragStart={p.onDragStart} onDragEnd={p.onDragEnd} title="Seret untuk memindahkan">
                <Icon name="grip" /><span className="edit-title">{p.title}</span>
            </span>
            <button className="icon-btn" style={{ width: 24, height: 24 }} aria-label={`Pindahkan ${p.title} ke kiri`} onClick={() => p.onMove(-1)}><Icon name="arrowLeft" size={14} /></button>
            <button className="icon-btn" style={{ width: 24, height: 24, transform: 'scaleX(-1)' }} aria-label={`Pindahkan ${p.title} ke kanan`} onClick={() => p.onMove(1)}><Icon name="arrowLeft" size={14} /></button>
            <span className="sizes" role="group" aria-label="Ukuran">
                {SIZES.filter((s) => p.sizes.includes(s)).map((s) => (
                    <button key={s} aria-pressed={p.size === s} onClick={() => p.onSize(s)} title={`Ukuran ${s}`}>{s}</button>
                ))}
            </span>
            {p.locked
                ? <span className="icon-btn" style={{ width: 24, height: 24 }} title="Widget wajib, tidak bisa dihapus"><Icon name="lock" size={14} /></span>
                : <button className="icon-btn" style={{ width: 24, height: 24 }} aria-label={`Hapus ${p.title}`} onClick={p.onRemove}><Icon name="close" size={14} /></button>}
        </div>
    );
}

const TABS = ['Semua', 'Penjualan', 'Gudang', 'Produksi', 'Impor'] as const;
function AddWidgetSheet({ present, onAdd, onClose }: { present: WidgetId[]; onAdd: (id: WidgetId) => void; onClose: () => void }) {
    const [tab, setTab] = useState<(typeof TABS)[number]>('Semua');
    const [q, setQ] = useState('');
    const list = useMemo(() => Object.values(WIDGETS)
        .filter((w) => !w.locked)
        .filter((w) => tab === 'Semua' || MODULE_LABEL[w.module] === tab)
        .filter((w) => !q || (w.title + w.desc).toLowerCase().includes(q.toLowerCase())), [tab, q]);
    return (
        <>
            <div className="scrim" onClick={onClose} />
            <aside className="sheet" role="dialog" aria-labelledby="sheet-t">
                <div className="sheet-head">
                    <h2 id="sheet-t">Tambah widget</h2>
                    <button className="icon-btn" aria-label="Tutup" onClick={onClose}><Icon name="close" /></button>
                </div>
                <div className="sheet-body">
                    <label className="search"><Icon name="search" /><span className="sr-only">Cari widget</span>
                        <input autoFocus placeholder="Cari widget" value={q} onChange={(e) => setQ(e.target.value)} />
                    </label>
                    <div className="tabs" role="tablist">
                        {TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{t}</button>)}
                    </div>
                    {list.length === 0 && <p className="state-empty" style={{ marginTop: 12 }}>Tidak ada widget yang cocok dengan “{q}”.</p>}
                    {list.map((w) => (
                        <div key={w.id} className="catalog-row">
                            <span className="thumb"><Thumb kind={w.thumb} /></span>
                            <span>
                                <div className="name">{w.title}</div>
                                <div className="desc">{w.desc}</div>
                                <div className="size">{MODULE_LABEL[w.module]} · ukuran {w.size}</div>
                            </span>
                            {present.includes(w.id)
                                ? <span className="added">Sudah ditambahkan</span>
                                : <button className="btn btn-secondary btn-sm" onClick={() => onAdd(w.id)}>Tambah</button>}
                        </div>
                    ))}
                </div>
                <div className="sheet-foot">Widget mengikuti filter cabang dan gudang di halaman.</div>
            </aside>
        </>
    );
}

export { AppLink };

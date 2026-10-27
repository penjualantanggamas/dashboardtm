// Grafik SVG kecil mengikuti DESIGN.md §8 dan taste-skill app-screens §6:
// satu pertanyaan per grafik, 3–5 gridline, tick bulat di atas maksimum, tanpa sumbu Y,
// batang siku, satu hue data (--chart-3) pada elemen utama.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { DaySales, Quota, Ship } from '@/data/types';
import { dayMonth, num, pct, rp } from '@/lib/format';

export function useWidth<T extends HTMLElement>(fallback = 600) {
    const ref = useRef<T>(null);
    const [w, setW] = useState(fallback);
    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    return [ref, w] as const;
}

export function useSize<T extends HTMLElement>(fw = 600, fh = 200) {
    const ref = useRef<T>(null);
    const [size, setSize] = useState({ w: fw, h: fh });
    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([e]) => setSize({ w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) }));
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    return [ref, size] as const;
}

export function niceTicks(max: number, count = 4) {
    const raw = max / count;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
    let hi = Math.ceil(max / step) * step;
    if (hi <= max) hi += step;
    const out: number[] = [];
    for (let v = 0; v <= hi + step / 2; v += step) out.push(+v.toFixed(6));
    return out;
}

// ---------- Penjualan harian vs target ----------
export function DailySalesChart({ days, target, today, minHeight = 180 }: { days: DaySales[]; target: number; today: number; minHeight?: number }) {
    const [ref, size] = useSize<HTMLDivElement>(600, minHeight);
    const w = size.w;
    const height = Math.max(minHeight, size.h);
    const [hover, setHover] = useState<number | null>(null);
    const left = 44, right = 8, top = 18, bottom = 24;
    const max = Math.max(target, ...days.map((d) => d.value ?? 0));
    const ticks = niceTicks(max, 4);
    const hi = ticks[ticks.length - 1];
    const pw = Math.max(10, w - left - right);
    const ph = height - top - bottom;
    const slot = pw / days.length;
    const bw = Math.max(3, Math.min(18, slot * 0.62));
    const y = (v: number) => top + ph - (v / hi) * ph;
    const ty = y(target);
    const hd = hover != null ? days[hover] : null;
    return (
        <div ref={ref} style={{ position: 'relative', flex: 1, minHeight }}>
            <svg style={{ position: 'absolute', inset: 0 }}
                className="chart" width={w} height={height} role="img"
                aria-label={`Penjualan harian Oktober. Hari ini ${rp(days[today - 1].value ?? 0)}, target harian ${rp(target)}.`}
                onMouseLeave={() => setHover(null)}
            >
                {ticks.map((t) => (
                    <g key={t}>
                        <line className={t === 0 ? 'base' : 'grid-line'} x1={left} x2={left + pw} y1={y(t)} y2={y(t)} />
                        <text x={left - 8} y={y(t) + 4} textAnchor="end">{t === 0 ? '0' : `${num(t / 1000, 1)} M`}</text>
                    </g>
                ))}
                {days.map((d, i) => {
                    const x = left + i * slot + (slot - bw) / 2;
                    const isToday = d.day === today;
                    return (
                        <g key={d.day} onMouseEnter={() => setHover(i)}>
                            <rect x={left + i * slot} y={top} width={slot} height={ph} fill="transparent" />
                            {d.value != null && d.value > 0 && (
                                <rect
                                    x={x} y={y(d.value)} width={bw} height={y(0) - y(d.value)}
                                    fill={isToday ? 'var(--chart-3)' : 'var(--chart-1)'}
                                    opacity={hover != null && hover !== i ? 0.55 : 1}
                                />
                            )}
                        </g>
                    );
                })}
                <line x1={left} x2={left + pw} y1={ty} y2={ty} stroke="var(--chart-2)" strokeDasharray="4 3" />
                <text x={left + pw} y={ty - 6} textAnchor="end">{w < 520 ? 'Target' : 'Target harian'} {rp(target)}</text>
                {[1, 8, 15, 22, 29].map((d) => (
                    <text key={d} x={left + (d - 0.5) * slot} y={height - 6} textAnchor="middle">{d}</text>
                ))}
            </svg>
            {hd && hd.value != null && (
                <div className="tip" style={{ left: Math.min(w - 170, left + hover! * slot + slot), top: 8 }}>
                    <strong>{hd.day} Okt{hd.day === today ? ' · hari ini' : ''}</strong>
                    <span>{hd.workday ? rp(hd.value) : 'Minggu, libur'}</span>
                    {hd.workday && <span className="muted">{pct((hd.value / target) * 100)} dari target</span>}
                </div>
            )}
        </div>
    );
}

// ---------- Kuota: terealisasi + dalam perjalanan + sisa ----------
export const quotaTone = (remainingPct: number) => (remainingPct < 15 ? 'neg' : remainingPct < 20 ? 'warn' : 'muted');

export function QuotaTracks({ quotas, tall = false }: { quotas: Quota[]; tall?: boolean }) {
    return (
        <div className="track-list">
            {quotas.map((q) => {
                const rem = q.quota - q.realised - q.inTransit;
                const rp100 = (rem / q.quota) * 100;
                return (
                    <div key={q.id}>
                        <div className="track-head">
                            <span className="name">{q.commodity}</span>
                            <span className={`num ${quotaTone(rp100)}`}>
                                {tall && <span className="muted">Sisa {num(rem)} t · </span>}
                                {pct(rp100)}
                            </span>
                        </div>
                        <div className={`track${tall ? ' tall' : ''}`} role="img"
                            aria-label={`${q.commodity}: ${num(q.realised)} t terealisasi, ${num(q.inTransit)} t berlayar, sisa ${num(rem)} t dari ${num(q.quota)} t`}>
                            <span className="seg-real" style={{ width: `${(q.realised / q.quota) * 100}%` }} />
                            <span className="seg-transit" style={{ width: `${(q.inTransit / q.quota) * 100}%` }} />
                        </div>
                        <div className="track-foot num">
                            <span>{num(q.realised)} dari {num(q.quota)} t</span>
                            <span>{num(q.inTransit)} t berlayar</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
export function QuotaLegend() {
    return (
        <div className="legend">
            <span><i style={{ background: 'var(--chart-3)' }} />Terealisasi</span>
            <span><i style={{ background: 'var(--chart-3-tint)' }} />Berlayar</span>
            <span><i style={{ background: 'var(--chart-track)', boxShadow: 'inset 0 0 0 1px var(--border)' }} />Sisa</span>
        </div>
    );
}

// ---------- Output vs rencana (bar dengan tick target) ----------
export function PlanBars({ rows }: { rows: { label: string; value: number; plan: number; sub?: ReactNode }[] }) {
    const scale = Math.max(...rows.map((r) => Math.max(r.plan, r.value)));
    return (
        <div className="track-list">
            {rows.map((r) => {
                const p = (r.value / r.plan) * 100;
                return (
                    <div key={r.label}>
                        <div className="track-head">
                            <span className="name">{r.label}</span>
                            <span className="num">
                                <span className={p < 90 ? 'neg' : undefined} style={{ fontWeight: 500 }}>{num(r.value)} t</span>
                                <span className="muted"> / {num(r.plan)} t ({pct(p)})</span>
                            </span>
                        </div>
                        <div className="track-wrap">
                            <div className="track">
                                <span className="seg-grey" style={{ width: `${(r.value / scale) * 100}%` }} />
                            </div>
                            <span className="tick" style={{ left: `calc(${(r.plan / scale) * 100}% - 1px)` }} />
                        </div>
                        {r.sub && <div className="track-foot">{r.sub}</div>}
                    </div>
                );
            })}
        </div>
    );
}

// ---------- Proyeksi kumulatif dengan garis kuota ----------
export function ForecastLine({ actual, forecastTo, limit, height = 200, labels }: {
    actual: number[]; // nilai per titik (bulan)
    forecastTo: { at: number; value: number; label: string }; // posisi pecahan pada sumbu
    limit: { value: number; label: string };
    labels: string[];
    height?: number;
}) {
    const [ref, w] = useWidth<HTMLDivElement>(360);
    const left = 48, right = 12, top = 22, bottom = 24;
    const ticks = niceTicks(limit.value, 4);
    const hi = ticks[ticks.length - 1];
    const pw = w - left - right, ph = height - top - bottom;
    const x = (i: number) => left + (i / (labels.length - 1)) * pw;
    const y = (v: number) => top + ph - (v / hi) * ph;
    const path = actual.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('');
    const last = actual.length - 1;
    return (
        <div ref={ref}>
            <svg className="chart" width={w} height={height} role="img"
                aria-label={`Pemakaian kumulatif, ${limit.label}, proyeksi ${forecastTo.label}`}>
                {ticks.map((t) => (
                    <g key={t}>
                        <line className={t === 0 ? 'base' : 'grid-line'} x1={left} x2={left + pw} y1={y(t)} y2={y(t)} />
                        <text x={left - 8} y={y(t) + 4} textAnchor="end">{t === 0 ? '0' : `${num(t / 1000)} rb`}</text>
                    </g>
                ))}
                <line x1={left} x2={left + pw} y1={y(limit.value)} y2={y(limit.value)} stroke="var(--chart-2)" strokeDasharray="4 3" />
                <text x={left + 4} y={y(limit.value) - 6}>{limit.label}</text>
                <path d={path} fill="none" stroke="var(--chart-3)" strokeWidth={2} />
                <path d={`M${x(last)},${y(actual[last])}L${x(forecastTo.at)},${y(forecastTo.value)}`} fill="none" stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="5 4" />
                <circle cx={x(forecastTo.at)} cy={y(forecastTo.value)} r={3.5} fill="var(--surface)" stroke="var(--chart-3)" strokeWidth={2} />
                <text x={x(forecastTo.at) - 8} y={y(forecastTo.value) - 8} textAnchor="end" style={{ fill: 'var(--text)' }}>{forecastTo.label}</text>
                {labels.map((l, i) => i % 2 === 0 && (
                    <text key={l} x={x(i)} y={height - 6} textAnchor={i === 0 ? 'start' : 'middle'}>{l}</text>
                ))}
            </svg>
        </div>
    );
}

// ---------- Elemen khas: jalur kedatangan kapal ----------
const DAY = 86_400_000;
export function ShipLanes({ ships, from, to, today, compact = false }: { ships: Ship[]; from: string; to: string; today: string; compact?: boolean }) {
    const [ref, w] = useWidth<HTMLDivElement>(800);
    const start = Date.parse(from), end = Date.parse(to);
    const n = Math.round((end - start) / DAY) + 1;
    const lane = compact ? 44 : 52, head = 26;
    const h = head + ships.length * lane;
    const col = w / n;
    const xOf = (iso: string) => {
        const d = Math.round((Date.parse(iso) - start) / DAY);
        return Math.max(0, Math.min(n, d)) * col + col / 2;
    };
    const days = Array.from({ length: n }, (_, i) => new Date(start + i * DAY));
    const labelEvery = n > 16 ? 7 : 2;
    return (
        <div className="lanes" style={compact ? { gridTemplateColumns: '170px minmax(0,1fr)' } : undefined}>
            <div>
                <div style={{ height: head }} />
                {ships.map((s) => (
                    <div key={s.id} className="lane-name" style={{ height: lane }}>
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                        <small>{s.commodity} · {num(s.load)} t</small>
                    </div>
                ))}
            </div>
            <div ref={ref} style={{ minWidth: 0 }}>
                <svg className="chart" width={w} height={h} role="img" aria-label="Jalur kedatangan kapal per tanggal">
                    {days.map((d, i) => {
                        const wd = d.getDay();
                        return (
                            <g key={i}>
                                {(wd === 0 || wd === 6) && <rect x={i * col} y={head} width={col} height={h - head} fill="var(--raised)" opacity={0.6} />}
                                <line x1={i * col} x2={i * col} y1={head} y2={h} stroke="var(--rule)" />
                                {i % labelEvery === 0 && <text x={i * col + col / 2} y={14} textAnchor="middle">{dayMonth(d)}</text>}
                            </g>
                        );
                    })}
                    <line x1={xOf(today)} x2={xOf(today)} y1={head - 6} y2={h} stroke="var(--chart-3)" />
                    {ships.map((s, i) => {
                        const cy = head + i * lane + lane / 2;
                        const x0 = xOf(s.departed), xp = xOf(s.etaPlanned), xe = xOf(s.etaEstimate);
                        const late = Date.parse(s.etaEstimate) - Date.parse(s.etaPlanned) > 0;
                        const lateDays = Math.round((Date.parse(s.etaEstimate) - Date.parse(s.etaPlanned)) / DAY);
                        const beforeStart = Date.parse(s.departed) < start;
                        return (
                            <g key={s.id}>
                                <line x1={i === -1 ? 0 : 0} x2={w} y1={head + i * lane} y2={head + i * lane} stroke="var(--rule)" />
                                <line x1={beforeStart ? 0 : x0} x2={late ? xp : xe} y1={cy} y2={cy} stroke="var(--chart-2)" strokeWidth={2} />
                                {!beforeStart && <circle cx={x0} cy={cy} r={2.5} fill="var(--chart-2)" />}
                                {late && <line x1={xp} x2={xe} y1={cy} y2={cy} stroke="var(--negative)" strokeWidth={3} />}
                                <line x1={xp} x2={xp} y1={cy - 7} y2={cy + 7} stroke="var(--chart-1)" strokeWidth={1.5} />
                                <circle cx={xe} cy={cy} r={5} fill="var(--chart-1)" />
                                <text x={xe + 10} y={cy + 4} style={{ fill: late ? 'var(--negative)' : 'var(--muted)' }}>
                                    {late ? `+${lateDays} hari` : dayMonth(s.etaEstimate)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
export function ShipLegend() {
    return (
        <div className="legend">
            <span><svg width="16" height="10"><line x1="0" x2="16" y1="5" y2="5" stroke="var(--chart-2)" strokeWidth="2" /></svg>Berlayar</span>
            <span><svg width="6" height="14"><line x1="3" x2="3" y1="0" y2="14" stroke="var(--chart-1)" strokeWidth="1.5" /></svg>ETA awal</span>
            <span><svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="var(--chart-1)" /></svg>Estimasi tiba</span>
            <span><svg width="16" height="10"><line x1="0" x2="16" y1="5" y2="5" stroke="var(--negative)" strokeWidth="3" /></svg>Keterlambatan</span>
            <span><svg width="6" height="14"><line x1="3" x2="3" y1="0" y2="14" stroke="var(--chart-3)" /></svg>Hari ini</span>
        </div>
    );
}

// ---------- Thumbnail katalog widget (ink/abu, tanpa kotak ikon berwarna) ----------
export function Thumb({ kind }: { kind: 'bars' | 'tracks' | 'lanes' | 'list' | 'figure' | 'kpi' }) {
    const ink = 'var(--chart-1)', grey = 'var(--chart-2)', hue = 'var(--chart-3)';
    return (
        <svg width="72" height="44" viewBox="0 0 72 44" aria-hidden="true">
            {kind === 'bars' && [8, 14, 11, 18, 16, 22, 26].map((h, i) => <rect key={i} x={4 + i * 9.5} y={40 - h} width={6} height={h} fill={i === 6 ? hue : ink} />)}
            {kind === 'tracks' && [0, 1, 2].map((i) => (<g key={i}><rect x={4} y={8 + i * 12} width={64} height={5} fill="var(--surface)" /><rect x={4} y={8 + i * 12} width={[50, 30, 42][i]} height={5} fill={hue} /></g>))}
            {kind === 'lanes' && [0, 1, 2].map((i) => (<g key={i}><line x1={6 + i * 6} x2={40 + i * 8} y1={10 + i * 12} y2={10 + i * 12} stroke={grey} strokeWidth={2} /><circle cx={40 + i * 8} cy={10 + i * 12} r={3} fill={ink} /></g>))}
            {kind === 'list' && [0, 1, 2, 3].map((i) => (<g key={i}><rect x={4} y={6 + i * 9} width={36} height={4} fill={ink} /><rect x={52} y={6 + i * 9} width={16} height={4} fill={grey} /></g>))}
            {kind === 'figure' && (<g><rect x={4} y={10} width={44} height={10} fill={ink} /><rect x={4} y={26} width={30} height={4} fill={grey} /></g>)}
            {kind === 'kpi' && [0, 1, 2].map((i) => (<g key={i}><rect x={4 + i * 23} y={10} width={16} height={4} fill={grey} /><rect x={4 + i * 23} y={18} width={18} height={8} fill={ink} /></g>))}
        </svg>
    );
}

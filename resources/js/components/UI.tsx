import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { AppLink } from './AppLink';
import { readSim, useLive } from '@/lib/store';
import { clock } from '@/lib/format';
import type { Severity } from '@/data/types';

export function Select({ value, options, onChange, label, lead }: {
    value: string; options: readonly string[]; onChange: (v: string) => void; label: string; lead?: IconName;
}) {
    return (
        <label className={`select-wrap${lead ? ' has-lead' : ''}`}>
            <span className="sr-only">{label}</span>
            {lead && <Icon name={lead} className="lead" />}
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <Icon name="chevronDown" size={14} />
        </label>
    );
}

export const SEVERITY_LABEL: Record<Severity, string> = { kritis: 'Kritis', perhatian: 'Perhatian', info: 'Info' };
export function SeverityPill({ s }: { s: Severity }) {
    return <span className={`pill ${s === 'kritis' ? 'pill-neg' : s === 'perhatian' ? 'pill-warn' : ''}`}>{SEVERITY_LABEL[s]}</span>;
}

export function useOutside<T extends HTMLElement>(open: boolean, close: () => void) {
    const ref = useRef<T>(null);
    useEffect(() => {
        if (!open) return;
        const on = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close(); };
        const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        document.addEventListener('mousedown', on);
        document.addEventListener('keydown', key);
        return () => { document.removeEventListener('mousedown', on); document.removeEventListener('keydown', key); };
    }, [open, close]);
    return ref;
}

export interface MenuItem { label: string; icon?: IconName; href?: string; onClick?: () => void }
export function Kebab({ items, label, button }: { items: MenuItem[]; label: string; button?: ReactNode }) {
    const [open, setOpen] = useState(false);
    const ref = useOutside<HTMLDivElement>(open, () => setOpen(false));
    return (
        <div ref={ref} style={{ position: 'relative' }}>
            {button ? (
                <button className="btn btn-secondary" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)}>{button}</button>
            ) : (
                <button className="icon-btn" aria-label={`Menu ${label}`} aria-expanded={open} onClick={() => setOpen(!open)}>
                    <Icon name="more" />
                </button>
            )}
            {open && (
                <div className="menu" role="menu" style={{ right: 0, top: button ? 42 : 36 }}>
                    {items.map((it) => it.href ? (
                        <AppLink key={it.label} href={it.href} onClick={() => setOpen(false)}>{it.icon && <Icon name={it.icon} />}{it.label}</AppLink>
                    ) : (
                        <button key={it.label} role="menuitem" onClick={() => { it.onClick?.(); setOpen(false); }}>{it.icon && <Icon name={it.icon} />}{it.label}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

/** Kerangka loading: bar abu datar seukuran nilai asli, tanpa shimmer. */
export function Skeleton({ rows = 4, lead = false }: { rows?: number; lead?: boolean }) {
    return (
        <div aria-busy="true" aria-label="Memuat">
            {lead && <span className="skel" style={{ width: 140, height: 30, marginBottom: 16 }} />}
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 44, borderTop: i ? '1px solid var(--rule)' : 0 }}>
                    <span className="skel" style={{ width: `${46 + ((i * 17) % 30)}%`, height: 12 }} />
                    <span className="skel" style={{ width: 48, height: 12 }} />
                </div>
            ))}
        </div>
    );
}

/** Kartu laporan dengan state loading / kosong / error / terputus (DESIGN.md §8). */
export function Card({ title, href, meta, menu, children, foot, className = '', empty, skeletonRows = 4, count, headExtra }: {
    title: string;
    href?: string;
    meta?: ReactNode;
    menu?: MenuItem[];
    children: ReactNode;
    foot?: ReactNode;
    className?: string;
    empty?: string; // kalimat state kosong
    skeletonRows?: number;
    count?: number;
    headExtra?: ReactNode;
}) {
    const sim = readSim();
    const { lastGood } = useLive();
    const [retry, setRetry] = useState(0);
    const failed = sim === 'error' && retry === 0;
    return (
        <section className={`card ${className}`} aria-label={title}>
            {headExtra}
            <div className="card-head">
                <h2 className="card-title">{href ? <AppLink href={href}>{title}</AppLink> : title}</h2>
                {count != null && <span className="count num">{count}</span>}
                <span className="meta">
                    {sim === 'offline' ? <span className="warn">Terputus · data terakhir {clock(lastGood).slice(0, 5)}</span> : meta}
                </span>
                {menu && <Kebab items={menu} label={title} />}
            </div>
            {sim === 'loading' ? <Skeleton rows={skeletonRows} /> : failed ? (
                <p className="state-error">
                    <Icon name="alert" />
                    <span>Gagal memuat data. Data terakhir {clock(lastGood).slice(0, 5)}.</span>
                    <button className="btn btn-text btn-sm" onClick={() => setRetry(1)}>Coba lagi</button>
                </p>
            ) : sim === 'empty' && empty ? (
                <p className="state-empty">{empty}</p>
            ) : (
                <>
                    {children}
                    {foot && <div className="card-foot">{foot}</div>}
                </>
            )}
        </section>
    );
}

/** Nilai yang disorot sebentar saat berubah (data live). */
export function Flash({ watch, children }: { watch: unknown; children: ReactNode }) {
    const [k, setK] = useState(0);
    const first = useRef(true);
    useEffect(() => { if (first.current) { first.current = false; return; } setK((x) => x + 1); }, [watch]);
    return <span key={k} className={k ? 'flash' : undefined}>{children}</span>;
}

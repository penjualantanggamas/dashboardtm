import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppLink, visit } from '@/components/AppLink';
import { Icon, type IconName } from '@/components/Icon';
import { SeverityPill, useOutside } from '@/components/UI';
import { buildAlerts, SHIPS } from '@/data/sample';
import { clock } from '@/lib/format';
import { MODULES, findPage } from '@/lib/nav';
import { getTheme, readSim, setTheme, startLive, useLive } from '@/lib/store';

interface Shared { app: { name: string }; user: { name: string; role: string } }

export default function AppShell({ children }: { children: ReactNode }) {
    const page = usePage();
    const url = page.url;
    const { app, user } = page.props as unknown as Shared;
    const current = findPage(url);
    const [open, setOpen] = useState<string | null>(current.module?.id ?? null);
    const [mobileNav, setMobileNav] = useState(false);
    useEffect(() => { startLive(); }, []);
    useEffect(() => { setOpen(current.module?.id ?? null); setMobileNav(false); }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

    const crumbs = current.module
        ? [{ label: current.module.label }, { label: current.page?.label ?? '' }]
        : [{ label: 'Ringkasan' }];
    const title = crumbs[crumbs.length - 1].label;

    return (
        <div className="shell">
            <aside className={`side${mobileNav ? ' open' : ''}`} aria-label="Navigasi utama">
                <div className="brand">
                    <span className="brand-mark" aria-hidden="true">TM</span>
                    <span>{app?.name ?? 'Dashboard TM'}</span>
                    {mobileNav && <button className="icon-btn" style={{ marginLeft: 'auto' }} aria-label="Tutup menu" onClick={() => setMobileNav(false)}><Icon name="close" /></button>}
                </div>
                <nav className="nav">
                    <AppLink href="/ringkasan" className="nav-item" aria-current={!current.module ? 'page' : undefined}>
                        <Icon name="ringkasan" />Ringkasan
                    </AppLink>
                    {MODULES.map((m) => (
                        <div key={m.id}>
                            <button
                                className="nav-item"
                                aria-expanded={open === m.id}
                                onClick={() => setOpen(open === m.id ? null : m.id)}
                            >
                                <Icon name={m.id as IconName} />{m.label}
                                <Icon name="chevronRight" size={14} className="chev" />
                            </button>
                            {open === m.id && (
                                <div className="nav-sub">
                                    {m.pages.map((p) => {
                                        const href = `/${m.id}/${p.slug}`;
                                        const active = current.module?.id === m.id && current.page?.slug === p.slug;
                                        return <AppLink key={p.slug} href={href} aria-current={active ? 'page' : undefined}>{p.label}</AppLink>;
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                <div className="side-foot">
                    <button className="nav-item"><Icon name="pengaturan" />Pengaturan</button>
                    <button className="nav-item"><Icon name="bantuan" />Bantuan</button>
                    <div className="user-row">
                        <span className="avatar" aria-hidden="true">{initials(user?.name ?? 'Rina Hartono')}</span>
                        <span>{user?.name ?? 'Rina Hartono'}<small>{user?.role ?? 'Direksi'}</small></span>
                    </div>
                </div>
            </aside>

            <div className="main">
                <div className="mbar">
                    <button className="icon-btn" aria-label="Buka menu" onClick={() => setMobileNav(true)}><Icon name="menu" /></button>
                    <span className="title">{title}</span>
                    <span className="grow" />
                    <LiveStamp short />
                    <Bell />
                </div>
                <header className="topline">
                    <div className="crumbs" aria-label="Lokasi">
                        {crumbs.map((c, i) => (
                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                {i > 0 && <Icon name="chevronRight" />}
                                <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>{c.label}</span>
                            </span>
                        ))}
                    </div>
                    <Search />
                    <div className="top-right">
                        <LiveStamp />
                        <ThemeToggle />
                        <Bell />
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
}

const initials = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');

function LiveStamp({ short = false }: { short?: boolean }) {
    const { now, lastGood } = useLive();
    const off = readSim() === 'offline';
    return (
        <span className={`live num${off ? ' off' : ''}`} role="status">
            <span className="dot" aria-hidden="true" />
            {off ? `Terputus · data terakhir ${clock(lastGood).slice(0, 5)}` : short ? 'Live' : `Live · diperbarui ${clock(now)}`}
        </span>
    );
}

function ThemeToggle() {
    const [t, setT] = useState<'light' | 'dark'>('light');
    useEffect(() => setT(getTheme()), []);
    const next = t === 'dark' ? 'light' : 'dark';
    return (
        <button className="icon-btn" aria-label={`Ganti ke tema ${next === 'dark' ? 'gelap' : 'terang'}`} onClick={() => { setTheme(next); setT(next); }}>
            <Icon name={t === 'dark' ? 'sun' : 'moon'} />
        </button>
    );
}

function Bell() {
    const [open, setOpen] = useState(false);
    const ref = useOutside<HTMLDivElement>(open, () => setOpen(false));
    const { todaySales } = useLive();
    const alerts = buildAlerts(todaySales).filter((a) => a.severity === 'kritis');
    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button className="icon-btn" aria-label={`Notifikasi, ${alerts.length} kritis`} aria-expanded={open} onClick={() => setOpen(!open)}>
                <Icon name="bell" />{alerts.length > 0 && <span className="badge" />}
            </button>
            {open && (
                <div className="menu" style={{ right: 0, top: 40, width: 320 }}>
                    {alerts.map((a) => (
                        <AppLink key={a.id} href={a.href} onClick={() => setOpen(false)} className="row-link alert-row">
                            <SeverityPill s={a.severity} /><span className="row-main">{a.text}</span>
                        </AppLink>
                    ))}
                    <hr />
                    <AppLink href="/ringkasan" onClick={() => setOpen(false)}>Semua yang perlu perhatian</AppLink>
                </div>
            )}
        </div>
    );
}

function Search() {
    const [q, setQ] = useState('');
    const [open, setOpen] = useState(false);
    const ref = useOutside<HTMLDivElement>(open, () => setOpen(false));
    useEffect(() => {
        const on = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.getElementById('global-search')?.focus(); }
        };
        window.addEventListener('keydown', on);
        return () => window.removeEventListener('keydown', on);
    }, []);
    const results = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (s.length < 2) return [];
        const pages = MODULES.flatMap((m) => m.pages.map((p) => ({ label: p.label, sub: m.label, href: `/${m.id}/${p.slug}` })))
            .filter((p) => p.label.toLowerCase().includes(s));
        const ships = SHIPS.filter((x) => x.name.toLowerCase().includes(s)).map((x) => ({ label: x.name, sub: 'Kapal', href: '/impor/jadwal-kapal' }));
        const sku = [{ label: `Cari "${q.trim()}" di Posisi Stok`, sub: 'SKU', href: `/gudang/posisi-stok?q=${encodeURIComponent(q.trim())}` }];
        return [...pages, ...ships, ...sku].slice(0, 6);
    }, [q]);
    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <label className="search">
                <Icon name="search" />
                <span className="sr-only">Cari</span>
                <input
                    id="global-search" value={q} placeholder="Cari laporan, SKU, kapal…"
                    onChange={(e) => { setQ(e.target.value); setOpen(true); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) { visit(results[0].href); setOpen(false); } }}
                />
                <span className="kbd">⌘K</span>
            </label>
            {open && results.length > 0 && (
                <div className="menu" style={{ left: 0, right: 0, top: 40 }}>
                    {results.map((r) => (
                        <AppLink key={r.href + r.label} href={r.href} onClick={() => setOpen(false)}>
                            <span>{r.label}</span><span className="muted" style={{ marginLeft: 'auto', fontSize: 12 }}>{r.sub}</span>
                        </AppLink>
                    ))}
                </div>
            )}
        </div>
    );
}

export function PageHead({ title, subline, actions }: { title: string; subline?: ReactNode; actions?: ReactNode }) {
    return (
        <div className="page-head">
            <div>
                <h1>{title}</h1>
                {subline && <p className="subline">{subline}</p>}
            </div>
            {actions && <div className="actions">{actions}</div>}
        </div>
    );
}

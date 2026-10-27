// Pengganti @inertiajs/react khusus build preview statis (tanpa server Laravel).
// Halaman memakai hash sederhana (#impor-kuota) karena hanya #nama yang bisa dibagikan.
// Query (?status=minimum) disimpan di memori, tidak di URL.
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

const MODULES = ['penjualan', 'gudang', 'produksi', 'impor'];
const toHash = (path: string) => path.split('?')[0].replace(/^\//, '').replace('/', '-');
function fromHash(h: string) {
    const name = h.replace(/^#/, '');
    const mod = MODULES.find((m) => name.startsWith(`${m}-`));
    if (mod) return `/${mod}/${name.slice(mod.length + 1)}`;
    return name ? `/${name}` : '/ringkasan';
}

let current = fromHash(window.location.hash);
const listeners = new Set<() => void>();
function go(path: string) {
    current = path;
    const h = toHash(path);
    if (window.location.hash.slice(1) !== h) window.location.hash = h;
    listeners.forEach((l) => l());
    window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => {
    const p = fromHash(window.location.hash);
    if (p !== current.split('?')[0]) { current = p; listeners.forEach((l) => l()); }
});
export const currentPath = () => current;

export function Link({ href, children, ...rest }: { href: string; children: ReactNode; className?: string; title?: string; onClick?: () => void }) {
    return (
        <a
            href={`#${toHash(href)}`}
            {...rest}
            onClick={(e: MouseEvent) => {
                rest.onClick?.();
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                go(href);
            }}
        >{children}</a>
    );
}
export const router = { visit: go };
export function Head({ title }: { title?: string }) {
    useEffect(() => { if (title) document.title = `${title} · Dashboard TM`; }, [title]);
    return null;
}
export function usePath() {
    const [p, setP] = useState(current);
    useEffect(() => { const l = () => setP(current); listeners.add(l); return () => { listeners.delete(l); }; }, []);
    return p;
}
export function usePage() {
    return { url: current, props: { app: { name: 'Dashboard TM' }, user: { name: 'Rina Hartono', role: 'Direksi', division: null } } };
}

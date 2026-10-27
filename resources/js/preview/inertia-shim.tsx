// Pengganti @inertiajs/react khusus build preview statis (tanpa server Laravel).
import { useEffect, useState, type ReactNode, type MouseEvent } from 'react';

export const currentPath = () => (window.location.hash.slice(1) || '/ringkasan');

export function Link({ href, children, ...rest }: { href: string; children: ReactNode; className?: string; title?: string; onClick?: () => void }) {
    return (
        <a
            href={`#${href}`}
            {...rest}
            onClick={(e: MouseEvent) => { rest.onClick?.(); if (e.metaKey || e.ctrlKey) return; }}
        >{children}</a>
    );
}
export const router = { visit: (href: string) => { window.location.hash = href; } };
export function Head({ title }: { title?: string }) {
    useEffect(() => { if (title) document.title = `${title} · Dashboard TM`; }, [title]);
    return null;
}
export function usePath() {
    const [p, setP] = useState(currentPath());
    useEffect(() => {
        const on = () => { setP(currentPath()); window.scrollTo(0, 0); };
        window.addEventListener('hashchange', on);
        return () => window.removeEventListener('hashchange', on);
    }, []);
    return p;
}
export function usePage() {
    return { url: currentPath(), props: { app: { name: 'Dashboard TM' }, user: { name: 'Rina Hartono', role: 'Direksi', division: null } } };
}

import { Link, router } from '@inertiajs/react';
import type { ReactNode } from 'react';

// Satu titik navigasi. Di Laravel memakai Inertia; di build preview, '@inertiajs/react'
// di-alias ke preview/inertia-shim.tsx (hash routing).
export function AppLink(props: { href: string; className?: string; title?: string; children: ReactNode; 'aria-current'?: 'page'; onClick?: () => void }) {
    const { href, children, ...rest } = props;
    return <Link href={href} {...rest}>{children}</Link>;
}
export const visit = (href: string) => router.visit(href);

import { Head, usePage } from '@inertiajs/react';
import { AppLink } from '@/components/AppLink';
import { findPage } from '@/lib/nav';
import AppShell, { PageHead } from '@/layouts/AppShell';

// Sub-menu yang belum dibangun di fase 1. Bangun dengan PROMPTS.md B2.
export default function Placeholder() {
    const { module, page } = findPage(usePage().url);
    const title = page?.label ?? 'Laporan';
    return (
        <AppShell>
            <Head title={title} />
            <PageHead title={title} subline={<>Bagian dari modul {module?.label}.</>} />
            <section className="card">
                <p className="state-empty">Laporan {title} belum dibangun di prototipe fase 1. Strukturnya mengikuti halaman <AppLink href="/impor/kuota">Kuota Impor</AppLink> (laporan) atau <AppLink href="/gudang/posisi-stok">Posisi Stok</AppLink> (daftar).</p>
            </section>
        </AppShell>
    );
}

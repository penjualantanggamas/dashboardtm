import type { ModuleId } from '@/data/types';

// Struktur menu (DESIGN.md §11). Sinkron dengan config/dashboard.php.
export interface NavPage { slug: string; label: string; built: boolean }
export interface NavModule { id: ModuleId; label: string; pages: NavPage[] }

export const MODULES: NavModule[] = [
    { id: 'penjualan', label: 'Penjualan', pages: [
        { slug: 'laporan', label: 'Laporan Penjualan', built: false },
        { slug: 'target', label: 'Target vs Realisasi', built: false },
        { slug: 'pelanggan', label: 'Per Pelanggan/Area', built: false },
        { slug: 'piutang', label: 'Piutang', built: false },
    ] },
    { id: 'gudang', label: 'Gudang', pages: [
        { slug: 'posisi-stok', label: 'Posisi Stok', built: true },
        { slug: 'mutasi', label: 'Mutasi Stok', built: false },
        { slug: 'kritis', label: 'Stok Kritis & Aging', built: false },
        { slug: 'opname', label: 'Stock Opname', built: false },
    ] },
    { id: 'produksi', label: 'Produksi', pages: [
        { slug: 'rencana', label: 'Rencana vs Realisasi', built: false },
        { slug: 'oee', label: 'Efisiensi Lini (OEE)', built: false },
        { slug: 'reject', label: 'Reject & QC', built: false },
        { slug: 'bahan-baku', label: 'Pemakaian Bahan Baku', built: false },
    ] },
    { id: 'impor', label: 'Impor', pages: [
        { slug: 'laporan', label: 'Laporan Impor', built: false },
        { slug: 'kuota', label: 'Kuota Impor', built: true },
        { slug: 'jadwal-kapal', label: 'Jadwal Kedatangan Kapal', built: true },
        { slug: 'dokumen', label: 'Status Dokumen', built: false },
    ] },
];

export function findPage(path: string) {
    const [, mod, slug] = path.split('?')[0].split('/');
    const m = MODULES.find((x) => x.id === mod);
    return { module: m, page: m?.pages.find((p) => p.slug === slug) };
}

// Bentuk data yang dipakai halaman. Saat backend siap, controller Laravel mengirim
// props dengan bentuk yang sama (lihat DashboardController.php).

export type Severity = 'kritis' | 'perhatian' | 'info';
export type ModuleId = 'penjualan' | 'gudang' | 'produksi' | 'impor';

export interface DaySales {
    day: number; // tanggal di Okt 2026
    value: number | null; // juta rupiah; null = belum terjadi
    workday: boolean;
}

export interface Quota {
    id: string;
    commodity: string;
    quota: number; // ton
    realised: number; // ton, sudah PIB
    inTransit: number; // ton, dihitung dari kapal
}

export interface Ship {
    id: string;
    name: string;
    commodity: string;
    load: number; // ton
    origin: string;
    departed: string; // ISO date
    etaPlanned: string;
    etaEstimate: string;
    port: string;
}

export interface Line {
    id: string;
    name: string;
    output: number; // ton hari ini
    plan: number;
    downtimeMin: number;
}

export interface Sku {
    code: string;
    name: string;
    warehouse: string;
    unit: 'kg' | 'roll' | 'pcs';
    stock: number;
    minimum: number;
    dailyUse: number;
    value: number; // juta rupiah
}

export interface Alert {
    id: string;
    severity: Severity;
    text: string;
    module: ModuleId;
    href: string;
}

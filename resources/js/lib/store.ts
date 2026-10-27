import { useSyncExternalStore } from 'react';
import { BRANCHES, TODAY_SALES_AT_OPEN, WAREHOUSES } from '@/data/sample';

// State global kecil: filter halaman, data live, tema. Bertahan antar-halaman (Inertia & preview).
type Listener = () => void;
function createStore<T>(initial: T) {
    let state = initial;
    const ls = new Set<Listener>();
    return {
        get: () => state,
        set: (patch: Partial<T>) => { state = { ...state, ...patch }; ls.forEach((l) => l()); },
        subscribe: (l: Listener) => { ls.add(l); return () => ls.delete(l); },
    };
}

// ---------- Simulasi kondisi (untuk review state) ----------
// ?sim=offline | loading | error | empty pada URL.
export type Sim = 'live' | 'offline' | 'loading' | 'error' | 'empty';
export function readSim(): Sim {
    if (typeof window === 'undefined') return 'live';
    const q = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : window.location.search.slice(1);
    const v = new URLSearchParams(q).get('sim');
    return (['offline', 'loading', 'error', 'empty'] as const).find((s) => s === v) ?? 'live';
}

// ---------- Filter global ----------
export const PRESETS = ['Hari ini', '7 hari', 'Bulan ini', 'Kuartal ini'] as const;
export const filters = createStore({
    period: 'Bulan ini' as (typeof PRESETS)[number],
    branch: 'Semua cabang',
    warehouse: 'Semua gudang',
});
export const BRANCH_OPTIONS = ['Semua cabang', ...BRANCHES];
export const WAREHOUSE_OPTIONS = ['Semua gudang', ...WAREHOUSES];
export const useFilters = () => useSyncExternalStore(filters.subscribe, filters.get, filters.get);

// ---------- Live (simulasi real-time) ----------
// Jam simulasi mulai Senin 26 Okt 2026 18:15:42 WIB dan berjalan mengikuti jam nyata.
const SIM_START = new Date('2026-10-26T18:15:42');
const realStart = Date.now();
export const live = createStore({
    now: SIM_START,
    lastGood: SIM_START,
    todaySales: TODAY_SALES_AT_OPEN,
    changed: 0, // penanda untuk sorotan nilai yang berubah
});
let started = false;
export function startLive() {
    if (started || typeof window === 'undefined') return;
    started = true;
    const sim = readSim();
    window.setInterval(() => {
        const now = new Date(SIM_START.getTime() + (Date.now() - realStart));
        if (sim === 'offline') { live.set({ now }); return; }
        const s = live.get();
        // Pesanan baru masuk ±60% dari tick: Rp 3–14 jt
        const add = Math.random() < 0.6 ? 3 + Math.round(Math.random() * 11) : 0;
        live.set({ now, lastGood: now, todaySales: s.todaySales + add, changed: add ? s.changed + 1 : s.changed });
    }, 5000);
}
export const useLive = () => useSyncExternalStore(live.subscribe, live.get, live.get);

// ---------- Tema ----------
export function getTheme(): 'light' | 'dark' {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}
export function setTheme(t: 'light' | 'dark') {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('dtm-theme', t); } catch { /* storage tidak tersedia */ }
}

// ---------- Penyimpanan aman ----------
export function load<T>(key: string, fallback: T): T {
    try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
export function save(key: string, value: unknown) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* abaikan */ }
}

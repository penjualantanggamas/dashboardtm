// Format angka & tanggal Indonesia (DESIGN.md §9). Semua angka tampil lewat sini.
const nf = (min: number, max = min) =>
    new Intl.NumberFormat('id-ID', { minimumFractionDigits: min, maximumFractionDigits: max });
export const MINUS = '−';

export const num = (v: number, d = 0) => nf(d).format(v);
export const pct = (v: number, d = 1) => `${nf(d).format(v)}%`;
export const signed = (v: number, f: (n: number) => string) =>
    (v > 0 ? '+' : v < 0 ? MINUS : '') + f(Math.abs(v));

/** Nilai dalam juta rupiah → "Rp 1,84 M", "Rp 41,2 M", "Rp 845 jt". */
export function rpParts(jt: number): { value: string; unit: string } {
    if (Math.abs(jt) >= 1000) {
        const m = jt / 1000;
        return { value: nf(Math.abs(m) < 10 ? 2 : 1).format(m), unit: 'M' };
    }
    return { value: nf(0).format(jt), unit: 'jt' };
}
export const rp = (jt: number) => {
    const p = rpParts(jt);
    return `Rp ${p.value} ${p.unit}`;
};
export const ton = (t: number) => `${num(t)} t`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const toDate = (d: string | Date) => (typeof d === 'string' ? new Date(`${d}T00:00:00`) : d);
export const dayMonth = (d: string | Date) => {
    const x = toDate(d);
    return `${x.getDate()} ${MONTHS[x.getMonth()]}`;
};
export const fullDate = (d: string | Date) => {
    const x = toDate(d);
    return `${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`;
};
export const monthName = (i: number) => MONTHS[i];
export const clock = (d: Date) =>
    [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
export const hm = (min: number) => `${Math.floor(min / 60)} j ${min % 60} m`;

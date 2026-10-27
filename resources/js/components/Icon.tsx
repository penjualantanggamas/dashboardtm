// Ikon outline 16px, stroke 1.5, satu set, abu-abu (DESIGN.md §5). Tanpa wadah berwarna.
const PATHS: Record<string, string> = {
    ringkasan: 'M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z',
    penjualan: 'M2 12l4-4 3 3 5-6M10 5h4v4',
    gudang: 'M2 6l6-3 6 3v7H2zM5 13V9h6v4M2 6h12',
    produksi: 'M2 14V7l4 2V7l4 2V4h4v10zM5 14v-2M9 14v-2',
    impor: 'M2 10h12l-1.5 3.5h-9zM4 10V7h8v3M7 7V3h2M3 15c1.5 0 1.5-.8 3-.8s1.5.8 3 .8 1.5-.8 3-.8',
    pengaturan: 'M8 10.2a2.2 2.2 0 100-4.4 2.2 2.2 0 000 4.4zM8 1.8v1.6M8 12.6v1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M1.8 8h1.6M12.6 8h1.6M3.6 12.4l1.1-1.1M11.3 4.7l1.1-1.1',
    bantuan: 'M8 14.2A6.2 6.2 0 108 1.8a6.2 6.2 0 000 12.4zM6.2 6.2a1.9 1.9 0 113 1.5c-.7.4-1.2.9-1.2 1.6M8 11.3v.2',
    search: 'M7 12A5 5 0 107 2a5 5 0 000 10zM14 14l-3.5-3.5',
    sun: 'M8 11a3 3 0 100-6 3 3 0 000 6zM8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1',
    moon: 'M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 107 7z',
    bell: 'M4 6.5a4 4 0 018 0c0 3.5 1.5 4.5 1.5 4.5h-11S4 10 4 6.5zM6.5 13.5a1.6 1.6 0 003 0',
    chevronRight: 'M6 3.5L10.5 8 6 12.5',
    chevronDown: 'M3.5 6L8 10.5 12.5 6',
    more: 'M3.5 8h.01M8 8h.01M12.5 8h.01',
    close: 'M4 4l8 8M12 4l-8 8',
    plus: 'M8 3v10M3 8h10',
    grip: 'M6 4h.01M10 4h.01M6 8h.01M10 8h.01M6 12h.01M10 12h.01',
    lock: 'M4.5 7.5h7v6h-7zM6 7.5V5.5a2 2 0 014 0v2',
    download: 'M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10',
    menu: 'M2.5 4.5h11M2.5 8h11M2.5 11.5h11',
    refresh: 'M13 3v3.5H9.5M3 13V9.5h3.5M12.6 6.5A5 5 0 004 4.6M3.4 9.5A5 5 0 0012 11.4',
    calendar: 'M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3',
    alert: 'M8 2L14.5 13.5h-13zM8 6.5v3M8 11.5v.01',
    arrowLeft: 'M13 8H3M7 4L3 8l4 4',
};
export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
    const dots = name === 'more' || name === 'grip';
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={dots ? 2.2 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            <path d={PATHS[name]} />
        </svg>
    );
}

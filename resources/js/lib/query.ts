import { usePage } from '@inertiajs/react';

/** Query string halaman saat ini (filter yang dibawa dari drill-down). */
export function useQuery() {
    const url = usePage().url;
    return new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
}

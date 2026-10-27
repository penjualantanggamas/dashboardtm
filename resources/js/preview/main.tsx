// Entry untuk build preview statis (tanpa Laravel). Routing via hash: #/impor/kuota
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { usePath } from './inertia-shim';
import Ringkasan from '@/pages/Ringkasan';
import JadwalKapal from '@/pages/Impor/JadwalKapal';
import Kuota from '@/pages/Impor/Kuota';
import PosisiStok from '@/pages/Gudang/PosisiStok';
import Placeholder from '@/pages/Placeholder';

const ROUTES: Record<string, ComponentType> = {
    '/ringkasan': Ringkasan,
    '/impor/jadwal-kapal': JadwalKapal,
    '/impor/kuota': Kuota,
    '/gudang/posisi-stok': PosisiStok,
};

function App() {
    const path = usePath().split('?')[0];
    const Page = ROUTES[path] ?? (path.split('/').length === 3 ? Placeholder : Ringkasan);
    return <Page key={usePath()} />;
}
createRoot(document.getElementById('app')!).render(<App />);

import { Head } from '@inertiajs/react';
import { ShipLanes, ShipLegend } from '@/components/Charts';
import { Icon } from '@/components/Icon';
import { Card, Select } from '@/components/UI';
import { daysLate, LATE_SHIPS, SHIPS, TODAY } from '@/data/sample';
import { dayMonth, num } from '@/lib/format';
import AppShell, { PageHead } from '@/layouts/AppShell';
import { useState } from 'react';

const COMMODITIES = ['Semua komoditas', ...Array.from(new Set(SHIPS.map((s) => s.commodity)))];

export default function JadwalKapal() {
    const [commodity, setCommodity] = useState('Semua komoditas');
    const ships = SHIPS.filter((s) => commodity === 'Semua komoditas' || s.commodity === commodity)
        .sort((a, b) => a.etaEstimate.localeCompare(b.etaEstimate));
    const total = ships.reduce((a, s) => a + s.load, 0);
    const late = ships.filter((s) => daysLate(s) > 0);
    return (
        <AppShell>
            <Head title="Jadwal Kedatangan Kapal" />
            <PageHead
                title="Jadwal Kedatangan Kapal"
                subline={<>{ships.length} kapal dalam perjalanan membawa {num(total)} t. {late.length ? <>{late.length} terlambat dari ETA awal; terlama <strong>{LATE_SHIPS.sort((a, b) => daysLate(b) - daysLate(a))[0].name}</strong>, +{daysLate(LATE_SHIPS[0])} hari.</> : 'Semua sesuai ETA awal.'}</>}
                actions={<button className="btn btn-secondary" onClick={() => window.print()}><Icon name="download" />Export</button>}
            />
            <div className="scope">
                <span className="btn btn-outline num" style={{ cursor: 'default' }}><Icon name="calendar" />20 Okt – 10 Nov 2026</span>
                <Select label="Komoditas" value={commodity} options={COMMODITIES} onChange={setCommodity} />
                <span className="chip-view">Tanjung Priok</span>
            </div>
            <div className="grid">
                <div className="w-Full" style={{ display: 'flex' }}>
                    <Card className="grow" title="Jalur kedatangan" meta={<ShipLegend />} skeletonRows={5}
                        empty="Tidak ada kapal dijadwalkan tiba dalam rentang ini.">
                        {ships.length ? <div className="table-scroll"><div style={{ minWidth: 720 }}><ShipLanes ships={ships} from="2026-10-20" to="2026-11-10" today={TODAY} /></div></div>
                            : <p className="state-empty">Tidak ada kapal {commodity} dalam rentang ini.</p>}
                    </Card>
                </div>
                <div className="w-Full" style={{ display: 'flex' }}>
                    <Card className="grow" title="Detail kapal" count={ships.length} skeletonRows={5}
                        empty="Tidak ada kapal dalam rentang ini.">
                        <div className="table-scroll">
                            <table className="data">
                                <thead><tr>
                                    <th>Kapal</th><th>Komoditas</th><th className="r">Muatan</th><th>Asal</th>
                                    <th>Berangkat</th><th>ETA awal</th><th>Estimasi tiba</th><th>Status</th>
                                </tr></thead>
                                <tbody>
                                    {ships.map((s) => {
                                        const d = daysLate(s);
                                        return (
                                            <tr key={s.id}>
                                                <td style={{ fontWeight: 500 }}>{s.name}</td>
                                                <td>{s.commodity}</td>
                                                <td className="r">{num(s.load)} <span className="muted">t</span></td>
                                                <td>{s.origin}</td>
                                                <td>{dayMonth(s.departed)}</td>
                                                <td>{dayMonth(s.etaPlanned)}</td>
                                                <td className={d > 0 ? 'neg' : undefined}>{dayMonth(s.etaEstimate)}</td>
                                                <td><span className={`pill ${d > 0 ? 'pill-neg' : 'pill-pos'}`}>{d > 0 ? `Terlambat ${d} hari` : 'Tepat waktu'}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}

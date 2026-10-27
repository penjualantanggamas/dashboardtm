import { Head } from '@inertiajs/react';
import { ForecastLine, QuotaLegend, QuotaTracks } from '@/components/Charts';
import { Icon } from '@/components/Icon';
import { AppLink } from '@/components/AppLink';
import { Card } from '@/components/UI';
import { PP_CUMULATIVE, PP_EXHAUST_DATE, PP_EXHAUST_DAYS, PP_RATE_PER_MONTH, QUOTA_HISTORY, QUOTAS, remaining, remainingPct, SHIPS } from '@/data/sample';
import { dayMonth, fullDate, monthName, num, pct } from '@/lib/format';
import AppShell, { PageHead } from '@/layouts/AppShell';

export default function Kuota() {
    const total = QUOTAS.reduce((a, q) => a + q.quota, 0);
    const realised = QUOTAS.reduce((a, q) => a + q.realised, 0);
    const transit = QUOTAS.reduce((a, q) => a + q.inTransit, 0);
    const pp = QUOTAS[0];
    // Posisi tanggal habis pada sumbu bulan (0 = akhir Jan … 9 = 26 Okt).
    const exhaustAt = 9 + PP_EXHAUST_DAYS / 30.4;
    return (
        <AppShell>
            <Head title="Kuota Impor" />
            <PageHead
                title="Kuota Impor"
                subline={<>Kuota {pp.commodity} tersisa {pct(remainingPct(pp))}. Pada laju {num(PP_RATE_PER_MONTH)} t/bulan, sisa {num(remaining(pp))} t habis sekitar <strong>{fullDate(PP_EXHAUST_DATE)}</strong>.</>}
                actions={<button className="btn btn-secondary" onClick={() => window.print()}><Icon name="download" />Export</button>}
            />
            <div className="scope"><span className="chip-view">Tahun kuota 2026</span></div>
            <div className="grid">
                <section className="card kpis w-Full" style={{ ['--n' as string]: 3 }} aria-label="Ringkasan kuota">
                    <div className="kpi"><div className="kpi-label">Total kuota 2026</div><div className="kpi-value">{num(total)}<span className="unit">t</span></div><div className="kpi-cap">{QUOTAS.length} komoditas</div></div>
                    <div className="kpi"><div className="kpi-label">Terealisasi</div><div className="kpi-value">{num(realised)}<span className="unit">t</span></div><div className="kpi-cap num">{pct((realised / total) * 100)} dari kuota</div></div>
                    <div className="kpi"><div className="kpi-label">Berlayar</div><div className="kpi-value">{num(transit)}<span className="unit">t</span></div><div className="kpi-cap"><AppLink href="/impor/jadwal-kapal">{SHIPS.length} kapal</AppLink></div></div>
                </section>
                <div className="w-XL" style={{ display: 'flex' }}>
                    <Card className="grow" title="Pemakaian kuota per komoditas" meta={<QuotaLegend />} skeletonRows={3}
                        empty="Belum ada kuota untuk tahun ini.">
                        <QuotaTracks quotas={QUOTAS} tall />
                    </Card>
                </div>
                <div className="w-M" style={{ display: 'flex' }}>
                    <Card className="grow" title={`Proyeksi habis ${pp.commodity}`} skeletonRows={3}>
                        <ForecastLine
                            actual={PP_CUMULATIVE}
                            labels={Array.from({ length: 12 }, (_, i) => monthName(i))}
                            limit={{ value: pp.quota, label: `Kuota ${num(pp.quota)} t` }}
                            forecastTo={{ at: exhaustAt, value: pp.quota, label: `±${dayMonth(PP_EXHAUST_DATE)}` }}
                            height={190}
                        />
                        <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>Garis putus-putus = proyeksi dari laju rata-rata Jan–Okt.</p>
                    </Card>
                </div>
                <div className="w-Full" style={{ display: 'flex' }}>
                    <Card className="grow" title="Riwayat realisasi" foot={<span>5 PIB terakhir</span>} skeletonRows={5}>
                        <div className="table-scroll">
                            <table className="data">
                                <thead><tr><th>No. PIB</th><th>Tanggal</th><th>Komoditas</th><th>Kapal</th><th className="r">Volume</th><th className="r">Porsi kuota</th></tr></thead>
                                <tbody>
                                    {QUOTA_HISTORY.map((h) => {
                                        const q = QUOTAS.find((x) => x.commodity === h.commodity)!;
                                        return (
                                            <tr key={h.pib}>
                                                <td className="mono">{h.pib}</td>
                                                <td>{fullDate(h.date)}</td>
                                                <td>{h.commodity}</td>
                                                <td>{h.ship}</td>
                                                <td className="r">{num(h.volume)} <span className="muted">t</span></td>
                                                <td className="r">{pct((h.volume / q.quota) * 100)}</td>
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

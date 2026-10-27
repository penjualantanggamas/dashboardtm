import { useState } from 'react';
import { Icon } from './Icon';
import { useOutside } from './UI';

declare const __PREVIEW__: boolean;
const IS_PREVIEW = typeof __PREVIEW__ !== 'undefined' && __PREVIEW__;

export interface ExportRows { name: string; rows: (string | number)[][] }

function downloadCsv({ name, rows }: ExportRows) {
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `${name}.csv`;
    a.click();
}

/** Tombol Export (sekunder) dengan menu PDF / Excel. Di build preview, export tidak tersedia. */
export function ExportMenu({ data }: { data: () => ExportRows }) {
    const [open, setOpen] = useState(false);
    const ref = useOutside<HTMLDivElement>(open, () => setOpen(false));
    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button className="btn btn-secondary" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
                <Icon name="download" />Export
            </button>
            {open && (
                <div className="menu" role="menu" style={{ right: 0, top: 42 }}>
                    {IS_PREVIEW ? (
                        <p className="muted" style={{ padding: '8px 10px', fontSize: 12, maxWidth: 220 }}>
                            Export PDF dan Excel tersedia di aplikasi Laravel, tidak di preview ini.
                        </p>
                    ) : (
                        <>
                            <button role="menuitem" onClick={() => { setOpen(false); window.print(); }}><Icon name="download" />PDF (cetak)</button>
                            <button role="menuitem" onClick={() => { setOpen(false); downloadCsv(data()); }}><Icon name="download" />Excel (CSV)</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

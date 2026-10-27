<?php

/*
 * Struktur menu dan halaman (DESIGN.md §11).
 * 'component' = nama halaman React di resources/js/pages.
 * Sub-menu baru: tambahkan di sini dan di resources/js/lib/nav.ts.
 */
return [
    'pages' => [
        'penjualan' => [
            'laporan' => ['component' => 'Placeholder'],
            'target' => ['component' => 'Placeholder'],
            'pelanggan' => ['component' => 'Placeholder'],
            'piutang' => ['component' => 'Placeholder'],
        ],
        'gudang' => [
            'posisi-stok' => ['component' => 'Gudang/PosisiStok'],
            'mutasi' => ['component' => 'Placeholder'],
            'kritis' => ['component' => 'Placeholder'],
            'opname' => ['component' => 'Placeholder'],
        ],
        'produksi' => [
            'rencana' => ['component' => 'Placeholder'],
            'oee' => ['component' => 'Placeholder'],
            'reject' => ['component' => 'Placeholder'],
            'bahan-baku' => ['component' => 'Placeholder'],
        ],
        'impor' => [
            'laporan' => ['component' => 'Placeholder'],
            'kuota' => ['component' => 'Impor/Kuota'],
            'jadwal-kapal' => ['component' => 'Impor/JadwalKapal'],
            'dokumen' => ['component' => 'Placeholder'],
        ],
    ],
];

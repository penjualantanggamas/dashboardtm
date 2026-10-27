<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

/**
 * Fase 1 (prototipe): setiap halaman merender komponen React dengan data contoh
 * dari resources/js/data/sample.ts.
 *
 * Fase berikutnya: kirim data asli sebagai props, mis.
 *   return Inertia::render('Impor/JadwalKapal', ['ships' => ShipService::upcoming($filters)]);
 * Bentuk props mengikuti tipe di resources/js/data/types.ts.
 */
class DashboardController extends Controller
{
    public function ringkasan(): Response
    {
        return Inertia::render('Ringkasan');
    }

    public function page(string $module, string $page): Response
    {
        $map = config('dashboard.pages');
        abort_unless(isset($map[$module][$page]), 404);

        return Inertia::render($map[$module][$page]['component'], [
            'module' => $module,
            'page' => $page,
        ]);
    }
}

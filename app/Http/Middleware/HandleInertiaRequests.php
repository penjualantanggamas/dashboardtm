<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * Props yang tersedia di semua halaman.
     * Fase 1: pengguna masih contoh. Fase berikutnya: ambil dari auth()->user()
     * beserta peran (Direksi / Manajer <divisi>) dan divisi miliknya untuk hak CRUD.
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'app' => [
                'name' => config('app.name', 'Dashboard TM'),
            ],
            'user' => [
                'name' => 'Rina Hartono',
                'role' => 'Direksi',
                'division' => null,
            ],
        ];
    }
}

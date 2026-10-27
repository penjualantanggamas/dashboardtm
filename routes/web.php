<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/ringkasan');
Route::get('/ringkasan', [DashboardController::class, 'ringkasan'])->name('ringkasan');
Route::get('/{module}/{page}', [DashboardController::class, 'page'])
    ->whereIn('module', ['penjualan', 'gudang', 'produksi', 'impor'])
    ->name('laporan');

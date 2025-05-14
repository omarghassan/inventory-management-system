<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\OrderController;

Route::post('admins/login', [AdminController::class, 'login']);

// Admin routes (protected)
Route::prefix('admins')->middleware(['auth:sanctum', 'ability:admin'])->group(function () {
    // Admin profile routes
    Route::get('/profile', [AdminController::class, 'profile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::post('/logout', [AdminController::class, 'logout']);
    
    // Admin resource routes
    Route::apiResource('admins', AdminController::class);
    
    // Products management
    Route::apiResource('products', ProductController::class);
    
    // Categories management
    Route::apiResource('categories', CategoryController::class);
    Route::get('categories/{category}/products', [CategoryController::class, 'products']);
    
    // Stock management
    Route::get('stocks', [StockController::class, 'index']);
    Route::get('products/{product}/stock/history', [StockController::class, 'history']);
    Route::post('products/{product}/stock/add', [StockController::class, 'addStock']);
    Route::post('products/{product}/stock/reduce', [StockController::class, 'reduceStock']);
    Route::post('products/{product}/stock/adjust', [StockController::class, 'adjustStock']);
    
    // Low stock notifications
    Route::post('stocks/check-low-stock', [StockController::class, 'checkLowStock']);
    
    // Order Management
    Route::apiResource('orders', OrderController::class);
    Route::post('orders/{order}/process', [OrderController::class, 'process']);
    Route::post('orders/{order}/fulfill', [OrderController::class, 'fulfill']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
});
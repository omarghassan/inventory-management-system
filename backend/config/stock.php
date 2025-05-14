<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Stock Management Settings
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration options for stock management.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Low Stock Threshold
    |--------------------------------------------------------------------------
    |
    | When a product's stock quantity falls below this threshold,
    | a notification will be sent to the administrators.
    |
    */
    'low_stock_threshold' => env('LOW_STOCK_THRESHOLD', 25),

    /*
    |--------------------------------------------------------------------------
    | Notification Settings
    |--------------------------------------------------------------------------
    |
    | Configure how stock notifications should be delivered.
    |
    */
    'notifications' => [
        'channels' => ['mail', 'database'],
    ],
]; 
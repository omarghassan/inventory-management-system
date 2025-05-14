<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Product;
use App\Models\StockItem;
use App\Notifications\LowStockNotification;
use Illuminate\Support\Facades\Notification;

class StockService
{
    /**
     * Check if a product's stock is below the threshold.
     *
     * @param Product $product
     * @return bool
     */
    public function isLowStock(Product $product): bool
    {
        $stockItem = $product->stockItem;
        
        if (!$stockItem) {
            return true; // No stock is considered as low stock
        }
        
        $threshold = config('stock.low_stock_threshold', 5);
        return $stockItem->quantity <= $threshold;
    }
    
    /**
     * Check stock level and send notification if it's low.
     * 
     * @param Product $product
     * @param int $currentQuantity
     * @return void
     */
    public function checkAndNotifyLowStock(Product $product, int $currentQuantity): void
    {
        $threshold = config('stock.low_stock_threshold', 5);
        
        if ($currentQuantity <= $threshold) {
            // Get all admins
            $admins = Admin::all();
            
            // Send notification to all admins
            Notification::send($admins, new LowStockNotification($product, $currentQuantity));
        }
    }
    
    /**
     * Check stock levels for all products and send notifications for low stocks.
     * 
     * @return int Number of products with low stock
     */
    public function checkAllProductsLowStock(): int
    {
        $count = 0;
        $threshold = config('stock.low_stock_threshold', 5);
        
        $lowStockItems = StockItem::with('product')
            ->where('quantity', '<=', $threshold)
            ->get();
        
        if ($lowStockItems->isNotEmpty()) {
            // Get all admins
            $admins = Admin::all();
            
            foreach ($lowStockItems as $stockItem) {
                // Send notification for each low stock product
                Notification::send($admins, new LowStockNotification(
                    $stockItem->product,
                    $stockItem->quantity
                ));
                
                $count++;
            }
        }
        
        return $count;
    }
} 
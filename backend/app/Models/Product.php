<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'image',
        'slug',
        'SKU',
        'price',
        'category_id',
        'active'
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the stock item for the product.
     */
    public function stockItem()
    {
        return $this->hasOne(StockItem::class);
    }

    /**
     * Get all stock movements for the product.
     */
    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Get all order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Check if product is in stock.
     */
    public function isInStock()
    {
        return $this->stockItem && $this->stockItem->quantity > 0;
    }

    /**
     * Get the available quantity.
     */
    public function getAvailableQuantity()
    {
        return $this->stockItem ? $this->stockItem->quantity : 0;
    }
}

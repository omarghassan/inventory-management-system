<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockItem extends Model
{
    /** @use HasFactory<\Database\Factories\StockItemFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['product_id', 'quantity'];

    /**
     * Get the product that owns the stock item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

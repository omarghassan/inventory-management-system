<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockMovement extends Model
{
    /** @use HasFactory<\Database\Factories\StockMovementFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'quantity_change',
        'reference_type', 
        'reference_id',
        'notes'
    ];

    /**
     * Get the product that owns the stock movement.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the owning reference model.
     */
    public function reference()
    {
        return $this->morphTo();
    }
}

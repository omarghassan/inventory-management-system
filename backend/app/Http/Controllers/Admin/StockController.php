<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockItem;
use App\Models\StockMovement;
use App\Http\Resources\StockItemResource;
use App\Http\Resources\StockMovementResource;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StockController extends Controller
{
    protected $stockService;

    /**
     * Create a new controller instance.
     *
     * @param StockService $stockService
     * @return void
     */
    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Display a listing of product stocks.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $stockItems = StockItem::with('product')->paginate(15);
        return StockItemResource::collection($stockItems);
    }

    /**
     * Display stock history for a specific product.
     *
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function history($productId)
    {
        $product = Product::findOrFail($productId);
        $movements = StockMovement::where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'product' => $product,
            'movements' => StockMovementResource::collection($movements)
        ]);
    }

    /**
     * Add stock to a product (restock).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function addStock(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($productId);
        $quantity = $request->input('quantity');
        $notes = $request->input('notes', 'Admin restock');
        
        try {
            DB::beginTransaction();
            
            // Create stock movement
            $movement = new StockMovement([
                'product_id' => $productId,
                'quantity_change' => $quantity,
                'reference_type' => 'App\Models\Admin',
                'reference_id' => Auth::id(),
                'notes' => $notes
            ]);
            $movement->save();
            
            // Update stock quantity
            $stockItem = $product->stockItem;
            if (!$stockItem) {
                $stockItem = new StockItem([
                    'product_id' => $productId,
                    'quantity' => $quantity
                ]);
            } else {
                $stockItem->quantity += $quantity;
            }
            $stockItem->save();
            
            DB::commit();

            // Check if stock is still low, even after adding
            $this->stockService->checkAndNotifyLowStock($product, $stockItem->quantity);
            
            return response()->json([
                'message' => 'Stock added successfully',
                'stock_item' => new StockItemResource($stockItem),
                'movement' => new StockMovementResource($movement)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to add stock: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Reduce stock from a product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function reduceStock(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($productId);
        $quantity = $request->input('quantity');
        $notes = $request->input('notes', 'Admin stock reduction');
        
        if (!$product->stockItem || $product->stockItem->quantity < $quantity) {
            return response()->json(['error' => 'Insufficient stock available'], 422);
        }
        
        try {
            DB::beginTransaction();
            
            // Create stock movement
            $movement = new StockMovement([
                'product_id' => $productId,
                'quantity_change' => -$quantity, // Negative for reduction
                'reference_type' => 'App\Models\Admin',
                'reference_id' => Auth::id(),
                'notes' => $notes
            ]);
            $movement->save();
            
            // Update stock quantity
            $stockItem = $product->stockItem;
            $stockItem->quantity -= $quantity;
            $stockItem->save();
            
            DB::commit();

            // Check if stock is now low after reduction
            $this->stockService->checkAndNotifyLowStock($product, $stockItem->quantity);
            
            return response()->json([
                'message' => 'Stock reduced successfully',
                'stock_item' => new StockItemResource($stockItem),
                'movement' => new StockMovementResource($movement)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to reduce stock: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Adjust stock to a specific level (for inventory corrections).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function adjustStock(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:0',
            'notes' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($productId);
        $newQuantity = $request->input('quantity');
        $notes = $request->input('notes');
        
        try {
            DB::beginTransaction();
            
            // Determine the quantity change
            $currentQuantity = $product->stockItem ? $product->stockItem->quantity : 0;
            $quantityChange = $newQuantity - $currentQuantity;
            
            // Create stock movement
            $movement = new StockMovement([
                'product_id' => $productId,
                'quantity_change' => $quantityChange,
                'reference_type' => 'App\Models\Admin',
                'reference_id' => Auth::id(),
                'notes' => $notes
            ]);
            $movement->save();
            
            // Update or create stock quantity
            $stockItem = $product->stockItem;
            if (!$stockItem) {
                $stockItem = new StockItem([
                    'product_id' => $productId,
                    'quantity' => $newQuantity
                ]);
            } else {
                $stockItem->quantity = $newQuantity;
            }
            $stockItem->save();
            
            DB::commit();
            
            // Check if adjusted stock is now low
            $this->stockService->checkAndNotifyLowStock($product, $stockItem->quantity);
            
            return response()->json([
                'message' => 'Stock adjusted successfully',
                'stock_item' => new StockItemResource($stockItem),
                'movement' => new StockMovementResource($movement)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to adjust stock: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Check all products for low stock and notify admins.
     *
     * @return \Illuminate\Http\Response
     */
    public function checkLowStock()
    {
        try {
            $count = $this->stockService->checkAllProductsLowStock();
            
            return response()->json([
                'message' => 'Low stock check completed',
                'low_stock_count' => $count,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to check low stock: ' . $e->getMessage()], 500);
        }
    }
} 
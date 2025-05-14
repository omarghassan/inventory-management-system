<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService
{
    protected $stockService;

    /**
     * Create a new service instance.
     *
     * @param StockService $stockService
     * @return void
     */
    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    /**
     * Create a new order
     *
     * @param array $orderData
     * @param array $items
     * @param string $createdBy type of user creating the order (Admin or User)
     * @param int $creatorId ID of the creator
     * @return Order
     * @throws Exception
     */
    public function createOrder(array $orderData, array $items, string $createdBy, int $creatorId): Order
    {
        try {
            DB::beginTransaction();

            // Create the order
            $order = Order::create($orderData);

            // Calculate total amount and add order items
            $totalAmount = 0;

            foreach ($items as $item) {
                // Get product
                $product = Product::findOrFail($item['product_id']);
                
                // Check if there's enough stock
                if (!$product->stockItem || $product->stockItem->quantity < $item['quantity']) {
                    throw new Exception("Insufficient stock for product: {$product->name}");
                }

                // Calculate line total
                $lineTotal = $product->price * $item['quantity'];
                $totalAmount += $lineTotal;

                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ]);

                // Update stock
                $this->updateStockForOrderItem($product, $item['quantity'], $order, $createdBy, $creatorId);
            }

            // Update the total amount
            $order->update(['total_amount' => $totalAmount]);

            DB::commit();
            return $order->fresh(['items.product']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update stock after order item is created
     *
     * @param Product $product
     * @param int $quantity
     * @param Order $order
     * @param string $createdBy
     * @param int $creatorId
     * @return void
     */
    protected function updateStockForOrderItem(Product $product, int $quantity, Order $order, string $createdBy, int $creatorId): void
    {
        // Reduce stock
        $stockItem = $product->stockItem;
        $stockItem->quantity -= $quantity;
        $stockItem->save();

        // Create stock movement record
        $movement = new StockMovement([
            'product_id' => $product->id,
            'quantity_change' => -$quantity, // Negative for reduction
            'reference_type' => $createdBy,
            'reference_id' => $creatorId,
            'notes' => "Order #{$order->id}"
        ]);
        $movement->save();

        // Check if stock is now low after order
        $this->stockService->checkAndNotifyLowStock($product, $stockItem->quantity);
    }

    /**
     * Update order status
     *
     * @param Order $order
     * @param string $status
     * @return Order
     */
    public function updateOrderStatus(Order $order, string $status): Order
    {
        $order->status = $status;
        $order->save();
        return $order;
    }

    /**
     * Mark an order as fulfilled
     *
     * @param Order $order
     * @return Order
     * @throws Exception
     */
    public function fulfillOrder(Order $order): Order
    {
        if ($order->status === 'completed') {
            throw new Exception("Order is already fulfilled");
        }

        return $this->updateOrderStatus($order, 'completed');
    }
} 
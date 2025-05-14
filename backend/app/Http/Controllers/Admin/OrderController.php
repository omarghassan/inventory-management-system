<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $orderService;

    /**
     * Create a new controller instance.
     *
     * @param OrderService $orderService
     * @return void
     */
    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display a listing of orders.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orders = Order::with('items.product')->latest()->paginate(15);
        return OrderResource::collection($orders);
    }

    /**
     * Store a newly created order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create order with initial status 'pending'
            $orderData = [
                'user_id' => $request->input('user_id'),
                'status' => 'pending',
                'total_amount' => 0, // Will be calculated in the service
                'notes' => $request->input('notes')
            ];

            $order = $this->orderService->createOrder(
                $orderData, 
                $request->input('items'),
                'App\\Models\\Admin',
                Auth::id()
            );

            return new OrderResource($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified order.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $order = Order::with('items.product')->findOrFail($id);
        return new OrderResource($order);
    }

    /**
     * Update the order status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,completed,cancelled',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $order = Order::findOrFail($id);
            
            // Update notes if provided
            if ($request->has('notes')) {
                $order->notes = $request->input('notes');
                $order->save();
            }
            
            // Update status
            $order = $this->orderService->updateOrderStatus($order, $request->input('status'));
            
            return new OrderResource($order->fresh('items.product'));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Mark an order as fulfilled.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function fulfill($id)
    {
        try {
            $order = Order::with('items.product')->findOrFail($id);
            
            if ($order->status !== 'processing') {
                return response()->json([
                    'error' => 'Only orders in processing status can be fulfilled'
                ], 400);
            }
            
            $order = $this->orderService->fulfillOrder($order);
            
            return new OrderResource($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Process the order (change status to 'processing').
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function process($id)
    {
        try {
            $order = Order::findOrFail($id);
            
            if ($order->status !== 'pending') {
                return response()->json([
                    'error' => 'Only pending orders can be processed'
                ], 400);
            }
            
            $order = $this->orderService->updateOrderStatus($order, 'processing');
            
            return new OrderResource($order->fresh('items.product'));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Cancel the order.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function cancel($id)
    {
        try {
            $order = Order::findOrFail($id);
            
            if (!in_array($order->status, ['pending', 'processing'])) {
                return response()->json([
                    'error' => 'Only pending or processing orders can be cancelled'
                ], 400);
            }
            
            $order = $this->orderService->updateOrderStatus($order, 'cancelled');
            
            return new OrderResource($order->fresh('items.product'));
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
} 
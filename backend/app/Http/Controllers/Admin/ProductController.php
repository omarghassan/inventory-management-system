<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $products = Product::with('category')->paginate(15);
        return response()->json($products);
    }

    /**
     * Store a newly created product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'SKU' => 'required|string|unique:products',
            'active' => 'boolean',
            'quantity' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $productData = $validator->validated();
        
        // Set default for active if not provided
        if (!isset($productData['active'])) {
            $productData['active'] = true;
        }
        
        // Generate a slug from the name
        $productData['slug'] = Str::slug($productData['name']);
        
        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('product_images', 'public');
            $productData['image'] = $path;
        }

        // Get the quantity for stock but don't save it to the product
        $quantity = $productData['quantity'];
        unset($productData['quantity']);
        
        // Create the product
        $product = Product::create($productData);
        
        // Create or update stock item
        $product->stockItem()->updateOrCreate(
            ['product_id' => $product->id],
            ['quantity' => $quantity]
        );

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('category', 'stockItem')
        ], 201);
    }

    /**
     * Display the specified product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $product = Product::with(['category', 'stockItem'])->findOrFail($id);
        return response()->json($product);
    }

    /**
     * Update the specified product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image' => 'nullable|image|max:2048',
            'price' => 'sometimes|required|numeric|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'SKU' => 'sometimes|required|string|unique:products,SKU,' . $id,
            'active' => 'boolean',
            'quantity' => 'sometimes|required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $productData = $validator->validated();
        
        // If name is changed, update the slug
        if (isset($productData['name'])) {
            $productData['slug'] = Str::slug($productData['name']);
        }
        
        // Handle image upload if provided
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            
            $path = $request->file('image')->store('product_images', 'public');
            $productData['image'] = $path;
        }

        // Get the quantity for stock but don't save it to the product
        $quantity = null;
        if (isset($productData['quantity'])) {
            $quantity = $productData['quantity'];
            unset($productData['quantity']);
        }
        
        // Update the product
        $product->update($productData);
        
        // Update stock item if quantity provided
        if ($quantity !== null) {
            $product->stockItem()->updateOrCreate(
                ['product_id' => $product->id],
                ['quantity' => $quantity]
            );
        }

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load('category', 'stockItem')
        ]);
    }

    /**
     * Remove the specified product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Soft delete the product
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
} 
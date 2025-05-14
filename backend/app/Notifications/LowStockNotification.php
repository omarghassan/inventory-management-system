<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $product;
    protected $currentStock;

    /**
     * Create a new notification instance.
     */
    public function __construct(Product $product, int $currentStock)
    {
        $this->product = $product;
        $this->currentStock = $currentStock;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return config('stock.notifications.channels', ['mail', 'database']);
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $threshold = config('stock.low_stock_threshold', 5);
        
        return (new MailMessage)
            ->subject('Low Stock Alert: ' . $this->product->name)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('This is to notify you that the following product has low stock:')
            ->line('Product: ' . $this->product->name . ' (SKU: ' . $this->product->SKU . ')')
            ->line('Current stock: ' . $this->currentStock . ' (Threshold: ' . $threshold . ')')
            ->action('View Product', url('/admin/products/' . $this->product->id))
            ->line('Please take appropriate action to restock this item.')
            ->salutation('Thank you for your attention to this matter.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'product_sku' => $this->product->SKU,
            'current_stock' => $this->currentStock,
            'threshold' => config('stock.low_stock_threshold', 5),
            'message' => 'Low stock alert for product: ' . $this->product->name,
        ];
    }
}

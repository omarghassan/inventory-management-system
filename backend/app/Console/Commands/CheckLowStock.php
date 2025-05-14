<?php

namespace App\Console\Commands;

use App\Services\StockService;
use Illuminate\Console\Command;

class CheckLowStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:check-low-levels';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check all products for low stock levels and notify administrators';

    /**
     * The stock service.
     *
     * @var \App\Services\StockService
     */
    protected $stockService;

    /**
     * Create a new command instance.
     */
    public function __construct(StockService $stockService)
    {
        parent::__construct();
        $this->stockService = $stockService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for products with low stock levels...');
        
        $count = $this->stockService->checkAllProductsLowStock();
        
        if ($count > 0) {
            $this->info("Found {$count} products with low stock levels. Notifications have been sent.");
        } else {
            $this->info('No products with low stock levels found.');
        }
        
        return Command::SUCCESS;
    }
}

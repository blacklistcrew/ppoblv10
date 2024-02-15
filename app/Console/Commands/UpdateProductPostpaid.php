<?php

namespace App\Console\Commands;

use App\Helper\DigiflazzHelper;
use App\Models\MstBrand;
use App\Models\MstCategory;
use App\Models\MstProduct;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UpdateProductPostpaid extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'productpostpaid:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update product postpaid ';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        Log::info($this->description . date('d-m-y H:i:s'));

        $df = new DigiflazzHelper();
        $products = $df->productPostpaid();

        $products = json_decode($products);
        if ($products->success !== true) {
            return;
        }

        if (!is_object($products->response)) {
            return;
        }

        echo '<pre>';
        print_r($products->response->data);
        die;

        foreach ($products->response->data as $p) {
            DB::beginTransaction();

            try {
                $slug = Str::slug($p->brand, '-');
                $category = MstCategory::firstOrNew(['slug' => $slug]);

                if (empty($category->name)) {
                    $category->name = ucwords($p->brand);
                    $category->type = 'postpaid';
                    $category->status = 1;
                    $category->save();
                }

                $brand = MstBrand::firstOrNew([
                    'name' => $p->brand,
                    'mst_category_id' => $category->id,
                ]);
                
                if (empty($brand->created_at)) {
                    $brand->status = 1;
                    $brand->save();
                }

                $product = MstProduct::firstOrNew([
                    'code' => $p->buyer_sku_code
                ]);

                $product->name = $p->product_name;
                $product->mst_category_id = $category->id;
                $product->mst_brand_id = $brand->id;
                // $product->code = $p->buyer_sku_code;
                $product->price = $p->price ?? 0;
                $product->desc = $p->desc;
                $product->status = ($p->buyer_product_status === true && $p->seller_product_status === true) ? 1 : 0;
                $product->save();

                DB::commit();
            } catch (Exception $e) {
                DB::rollback();
                Log::error($e->getMessage());

                echo '<pre>';
                print_r($e->getMessage());
                die;
            }
        }
    }
}

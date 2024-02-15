<?php

namespace App\Console\Commands;

use App\Helper\DigiflazzHelper;
use App\Models\MstBrand;
use App\Models\MstCategory;
use App\Models\MstPrefixPhone;
use App\Models\MstProduct;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UpdateProductPrepaid extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'productprepaid:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update product prepaid ';

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

        $products = $df->productPrepaid();
        $products = json_decode($products);

        if ($products->success != true) {
            return;
        }

        if (!is_object($products->response)) {
            return;
        }

        $listPrefixPhone = [];
        foreach (MstPrefixPhone::all() as $v) {
            $listPrefixPhone[$v->name] = $v->prefix;
        }

        foreach ($products->response->data as $p) {
            $productCategory = $p->category;
            $slugCategory = Str::slug($productCategory);
            $operatorName = $p->type;
            $desc = !empty($p->desc) ? $p->desc : NULL;

            switch ($slugCategory) {
                case MstCategory::TYPE_DATA:
                case MstCategory::TYPE_PULSE:
                case MstCategory::TYPE_ACTIVE_PERIOD:
                    $operatorName = $p->type == 'Umum' ? $p->brand . ' Basic' : $operatorName;
                    break;
                case MstCategory::TYPE_GAME:
                    $operatorName = $p->brand;
                    $desc = "No tujuan = ID Player";

                    switch ($p->brand) {
                        case 'MOBILE LEGEND':
                            $desc = "No tujuan = gabungan antara user_id dan zone_id";
                            break;
                        case 'Genshin Impact':
                            $desc = " No tujuan = gabungan id Server dan user id";
                            break;
                    }
                    break;
                case MstCategory::TYPE_EMONEY:
                case MstCategory::TYPE_VOUCHER:
                    $operatorName = $p->brand;
                    break;
                case MstCategory::TYPE_PLN:
                    break;
                default:
                    continue 2;
            }

            DB::beginTransaction();
            try {
                $category = MstCategory::firstOrNew(['slug' => $slugCategory]);

                if (empty($category->name)) {
                    $category->name = $productCategory;
                    $category->type = 'prepaid';
                    $category->status = 1;
                    $category->save();
                }

                $brand = MstBrand::firstOrNew([
                    'name' => $operatorName,
                    'mst_category_id' => $category->id,
                ]);

                if (strlen($brand->status) == 0) {
                    $brand->prefix = $this->contains($p->brand, $listPrefixPhone);
                    $brand->status = 1;
                    $brand->save();
                }

                $product = MstProduct::firstOrNew([
                    'mst_category_id' => $category->id,
                    'mst_brand_id' => $brand->id,
                    'code' => $p->buyer_sku_code,
                ]);

                if (empty($product->name)) {
                    $product->name = strtoupper($p->product_name);
                }

                $product->desc = $desc;
                $productStatus = ($p->buyer_product_status == true) && ($p->seller_product_status == true) && ($p->unlimited_stock == true || $p->stock > 0);
                $product->price = $p->price;
                $product->status = $productStatus;
                $product->save();

                DB::commit();
            } catch (Exception $e) {
                Log::error($e->getMessage());
                echo '<pre>';
                print_r($e->getMessage());
                die;
            }
        }
    }

    function contains($str, array $arr)
    {
        foreach ($arr as $key => $a) {
            if (stripos($str, $key) !== false) return $a;
        }
        return null;
    }
}

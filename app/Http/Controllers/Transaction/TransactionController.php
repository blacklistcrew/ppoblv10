<?php

namespace App\Http\Controllers\Transaction;

use App\Helper\DigiflazzHelper;
use App\Http\Controllers\Controller;
use App\Jobs\ProcessPrepaid;
use App\Models\MstCategory;
use App\Models\MstProduct;
use App\Models\MstSetting;
use App\Models\Transaction;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{

    public function index(Request $request): Response
    {
        return Inertia::render('Transaction/Index', [
            'models' => MstCategory::orderBy('type')->get()
        ]);
    }

    public function show(Request $request, string $code)
    {
        $category = MstCategory::with(['brands', 'products'])
            ->where('slug', $code)
            ->first();

        if (empty($category)) {
            return redirect('/transaction');
        }

        switch ($category->slug) {
            case MstCategory::TYPE_DATA:
            case MstCategory::TYPE_PULSE:
            case MstCategory::TYPE_ACTIVE_PERIOD:
                return Inertia::render('Transaction/Detail/Phone', compact('category'));
            case MstCategory::TYPE_PLN:
                $products = $category->products;

                return Inertia::render('Transaction/Detail/Pln', compact('category', 'products'));
            case MstCategory::TYPE_EMONEY:
            case MstCategory::TYPE_VOUCHER:
            case MstCategory::TYPE_GAME:
                $brands = $category->brands;

                return Inertia::render('Transaction/Detail/Emoney', compact('category', 'brands'));
            case MstCategory::TYPE_BPJS:
            case MstCategory::TYPE_INTERNET_POSTPAID:
            case MstCategory::TYPE_PDAM:
            case MstCategory::TYPE_GAS_POSTPAID:
            case MstCategory::TYPE_PLN_POSTPAID:
                $products = $category->products;
                $isPln = $category->slug == MstCategory::TYPE_PLN_POSTPAID;

                return Inertia::render('Transaction/Detail/Post', compact('category', 'products', 'isPln'));
        }

        return redirect('/transaction');
    }

    public function listProduct(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_category' => ['required', 'int'],
            'id_brand' => ['nullable', 'int'],
            'phone' => ['nullable', 'string'],
        ]);

        $id_category = $validated['id_category'];
        $id_brand = $validated['id_brand'] ?? null;
        $phone = $validated['phone'] ?? null;

        if (empty($id_category)) {
            return response()->json([]);
        }

        $products = MstProduct::where('mst_category_id', $id_category)
            ->when($phone, function ($qry, $phone) {
                $truncatedPhone = substr($phone, 0, 4);

                $qry->whereHas('brand', function ($q) use ($truncatedPhone) {
                    $q->where('prefix', 'like', "%$truncatedPhone%");
                });
            })
            ->when($id_brand, function ($query, $id_brand) {
                $query->where('mst_brand_id', $id_brand);
            })
            ->get();

        return response()->json($products);
    }

    public function validateNoPln(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_customer' => ['required', 'string', 'digits:12'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success'   => false,
                'message'   => $validator->errors()->first()
            ]);
        }

        $validated = $validator->validated();

        $df = new DigiflazzHelper();
        $res = $df->validateNoPln($validated['id_customer']);

        return response()->json([
            'success' => !empty(json_decode($res)->response->data->customer_no),
        ]);
    }

    public function createPrepaid(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_product'  => 'required|int',
            'target' => 'required_without:id_customer|string',
            'id_customer' => 'required_without:target|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ]);
        }

        $v = $validator->validated();

        $user = $request->user();

        if ($user->status != 1) {
            return response()->json([
                'success'   => false,
                'message'   => 'Your account inactive'
            ]);
        }

        $product = MstProduct::find($v['id_product']);

        if (!$product) {
            return response()->json([
                'success'   => false,
                'message'   => 'Product not found'
            ]);
        }

        if ($product->status != 1) {
            return response()->json([
                'success'   => false,
                'message'   => 'Product inactive'
            ]);
        }

        if ($user->saldo < $product->price) {
            return response()->json([
                'success'   => false,
                'message'   => 'Balance is not enough for this transaction'
            ]);
        }

        $ltx = Transaction::where('code', $product->code)
            ->where(function ($ant) use ($v) {
                $ant->where('target', $v['target'] ?? null)
                    ->orWhere('mtrpln', $v['id_customer'] ?? null);
            })
            ->whereNot('status', Transaction::STAT_PROCESS)
            ->where('created_at', '>=', Carbon::now()->subMinutes(5)->toDateTimeString())
            ->count();

        if ($ltx > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Please wait for 5 minute before do same transaction'
            ]);
        }

        try {
            $oldBalance = $user->saldo;
            $newBalance = $oldBalance - $product->price;

            $user->saldo = $newBalance;
            $user->save();

            $trx = new Transaction();
            $trx->code  = $product->code;
            $trx->product_name  = $product->name;
            $trx->total = $product->price;
            $trx->target = $v['target'] ?? null;

            if (!empty($v['id_customer'])) {
                $trx->mtrpln = $v['id_customer'];
                $trx->target    = null;
            }

            $trx->note = "Processing";
            $trx->status = Transaction::STAT_PROCESS;
            $trx->mst_product_id = $product->id;
            $trx->user_id = $user->id;
            $trx->save();

            dispatch(new ProcessPrepaid($trx));

            return response()->json([
                'success'   => true,
                'data' => [
                    'id' => $trx->id,
                ],
            ]);
        } catch (Exception $e) {
            if ($e instanceof \PDOException) {
                Log::error($e);
            }

            return response()->json([
                'success'   => false,
                'message'   => 'Transaction cannot process.' . $e->getMessage(),
            ]);
        }
    }

    public function checkPostpaid(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_product'  => 'required|int',
            'id_customer' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success'   => false,
                'message'   => $validator->errors()->first()
            ]);
        }

        $validated = $validator->validated();
        $user = $request->user();

        if ($user->status != 1) {
            return response()->json([
                'success'   => false,
                'message'   => 'Your account inactive'
            ]);
        }

        $product = MstProduct::find($validated['id_product']);
        if (!$product) {
            return response()->json([
                'success'   => false,
                'message'   => 'Product not found'
            ]);
        }

        if ($product->status != 1) {
            return response()->json([
                'success'   => false,
                'message'   => 'Product inactive'
            ]);
        }

        $id_customer = $request->id_customer;
        $checkExistingTrx = Transaction::where(['code' => $product->code, 'product_name' => $product->name])
            ->where(function ($query) use ($id_customer) {
                $query->orWhere('target', $id_customer)
                    ->orWhere('mtrpln', $id_customer);
            })
            ->whereIn('status', [Transaction::STAT_PROCESS, Transaction::STAT_WAITING_PAYMENT])
            ->first();

        if ($checkExistingTrx) {
            return response()->json([
                'success'   => false,
                'message'   => 'You have check for this bill with ID Customer ' . $id_customer . ' (' . ucwords($checkExistingTrx->nama) . ')',
            ]);
        }

        DB::beginTransaction();
        try {
            $trx                 = new Transaction();
            $trx->code           = $product->code;
            $trx->target         = $request->id_customer;
            $trx->product_name   = $product->name;
            $trx->total          = 0;
            $trx->user_id        = $user->id;
            $trx->mst_product_id = $product->id;
            $trx->save();

            $df = new DigiflazzHelper();

            $billJson = $df->checkPostpaid($product->code, $request->id_customer, $trx->id);
            $bill = json_decode($billJson);

            if ($bill->success !== true) {
                DB::rollBack();
                return response()->json([
                    'success'   => false,
                    'message'   => $bill->message
                ]);
            }

            $serverBalance = $df->balance();
            $serverBalance = json_decode($serverBalance);

            $bill = $bill->response->data;

            if ($serverBalance->response->data->deposit < $bill->price) {
                DB::rollBack();
                return response()->json([
                    'success'   => false,
                    'message'   => 'Sistem pembayaran error, mohon laporkan admin supaya bisa segera ditangani. Terima kasih'
                ]);
            }

            $kategori = strtoupper($product->category->name);
            if ($kategori != 'HP PASCABAYAR') {
                $period = $bill->desc->detail[0]->periode;
            }

            $detail = $bill->desc->detail;
            $end   = end($detail);
            $jumlahTagihan = count($bill->desc->detail);

            if ($jumlahTagihan > 1) {
                $period  = $detail[0]->periode . ' - ' . $end->periode;
            } else {
                $period = $detail[0]->periode;
            }

            $trx->update([
                'target'       => $bill->customer_no,
                'name'         => ucwords($bill->customer_name),
                'note'         => $period,
                'total'        => $bill->selling_price,
                'status'       => Transaction::STAT_WAITING_PAYMENT,
                'api_response' => $billJson,
            ]);

            DB::commit();

            return response()->json([
                'success'   => true,
                'message'   => 'Success checking',
                'data'      => ['id' => $trx->id]
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            if ($e instanceof \PDOException) {
                Log::error($e);
            }

            return response()->json([
                'success'   => false,
                'message'   => 'Payment failed. Please try again [' . $e->getMessage() . ']'
            ]);
        }
    }

    public function payPostpaid(Request $request, Transaction $transaction)
    {
        if (!$transaction) {
            return response()->json([
                'success'   => false,
                'message'   => 'Transaction not found'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|int'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ]);
        }

        $user = $transaction->user;

        if ($user->status != 1) {
            return response()->json([
                'success'   => false,
                'message'   => 'Your account not activated'
            ]);
        }

        if ($user->saldo < $transaction->total) {
            return response()->json([
                'success'   => false,
                'message'   => 'Balance not enough'
            ]);
        }

        $validated = $validator->validated();
        if (empty($validated['type'])) {
            $transaction->status = Transaction::STAT_FAILED;
            $transaction->note = 'Transaction canceled';
            $transaction->save();

            return response()->json([
                'success'   => true,
                'message'   => $transaction->note
            ]);
        }

        if ($transaction->status != Transaction::STAT_WAITING_PAYMENT) {
            $msg = '';

            switch ($transaction->status) {
                case Transaction::STAT_FAILED:
                    $msg = 'Transaction failed';
                    break;
                case Transaction::STAT_PROCESS:
                    $msg = 'Transaction still on process';
                    break;
                case Transaction::STAT_SUCCCESS:
                    $msg = 'Transaction has success payment';
                    break;
            }

            return response()->json([
                'success'   => false,
                'message'   => $msg
            ]);
        }

        $settings = MstSetting::first();
        if ($settings->status == 0) {
            return response()->json([
                'success'   => false,
                'message'   => 'System on maintenance'
            ]);
        }

        DB::beginTransaction();
        try {
            $df = new DigiflazzHelper();

            $payBillJson = $df->payBill($transaction->id, $transaction->code, $transaction->sequence_id, $transaction->target);
            $payBill = json_decode($payBillJson);

            if ($payBill->success != true) {
                $transaction->status = Transaction::STAT_PROCESS;
                $transaction->save();

                return response()->json([
                    'success'   => false,
                    'message'   => $payBill->message
                ]);
            }
            $payBill = $payBill->response->data;

            $transaction->token  =  $payBill->sn;
            $transaction->api_response = $payBillJson;
            $transaction->total = $payBill->selling_price;
            $transaction->status = Transaction::STAT_SUCCCESS;
            $transaction->note = 'Pay bill ' . $transaction->product_name . ' ' . $transaction->target . ' Period: ' . $transaction->note . ' - ' . $payBill->message;
            $transaction->save();

            $oldBalance = $user->saldo;
            $newBalance = $oldBalance - $transaction->total;

            $user->refresh();
            $user->saldo = $newBalance;
            $user->save();

            DB::commit();

            return response()->json([
                'success'   => true,
                'message'   => 'Trunsaction success'
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            if ($e instanceof \PDOException) {
                Log::error($e);
            }

            return response()->json([
                'success'   => false,
                'message'   => 'Transaction cannot process. Please try again ' . $e->getMessage()
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MstSetting;
use App\Models\Transaction;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DigiflazzWebhookController extends Controller
{
    private $secret = '';

    public function __construct()
    {
        $setting = MstSetting::first();

        $this->secret = $setting->api_secret;
    }

    public function listen(Request $request)
    {
        DB::beginTransaction();

        try {
            if (empty($request->header('X-Hub-Signature'))) {
                throw new Exception("Undefined Signature");
            }

            $content = $request->getContent();

            $sign = hash_hmac('sha1', $content, $this->secret);

            if (!hash_equals('sha1=' . $sign, $request->header('X-Hub-Signature'))) {
                throw new Exception("Invalid Signature");
            }

            $content = json_decode($content);

            if ($request->header('X-Digiflazz-Event') == 'update') {
                $prabayar     = false;

                if (preg_match('/DigiFlazz\-Hookshot/i', $request->server('HTTP_USER_AGENT'))) {
                    $prabayar = true;
                }

                if ($prabayar) {
                    $this->prabayar($content);
                } else {
                    $this->pascabayar($content);
                }
            }
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e);
        }
    }

    private function prabayar($content)
    {
        try {
            $data           = $content->data;
            $status         = strtolower($data->status);
            $customer_no    = explode('.', $data->customer_no);

            if (count($customer_no) > 1) {
                if (preg_match('/^[\d]+$/i', $customer_no[0])) // if sequence detected
                {
                    $sl             = strlen($customer_no[0]) + 1;
                    $customer_no    = substr($data->customer_no, $sl);
                } else {
                    $customer_no = $data->customer_no;
                }
            } else {
                $customer_no = $data->customer_no;
            }

            $is_pln = strtoupper(substr($data->buyer_sku_code, 0, 3)) == 'PLN' ? true : false;

            $trx = Transaction::firstWhere('order_id', $data->ref_id);

            if (!$trx) {
                return false;
            }

            if ($trx->status != Transaction::STAT_PROCESS) {
                return false;
            }

            if ($trx->sequence_id > 1) {
                if ($data->customer_no != $trx->sequence_id . '.' . ($is_pln ? $trx->mtrpln : $trx->target)) {
                    return false;
                }
            }

            $user         = $trx->user;
            $productPrice = $trx->total;

            if ($status == 'sukses') {
                $trx->token   = isset($data->sn) ? $data->sn : "";
                $trx->note    =  "Trx " . $data->buyer_sku_code . " " . $customer_no . " Success. SN : " . $trx->token;
                $trx->status  = Transaction::STAT_SUCCCESS;
            } elseif ($status == 'gagal') {
                if (preg_match('/(saldo|sedang.*gangguan)/i', $data->message)) {
                    $note = "Product in problem";
                } else {
                    $note = $data->message;
                }

                $user->refresh();
                $user->saldo = $user->saldo + $productPrice;

                $trx->note   = $note . ". Saldo refund";
                $trx->status = Transaction::STAT_FAILED;
            }

            $user->save();
            $trx->save();

            DB::commit();
        } catch (\Exception $e) {
            Log::error($e);
        }
    }

    private function pascabayar($content)
    {
        try {
            $data           = $content->data;
            $status         = strtolower($data->status);
            $customer_no    = $data->customer_no;

            $trx = Transaction::firstWhere('order_id', $data->ref_id);

            if (!$trx) {
                return;
            }

            if ($trx->status != Transaction::STAT_PROCESS) {
                return false;
            }

            $user           = $trx->user;
            $productPrice   = $trx->total;

            if ($status == 'sukses') {
                $trx->token   = isset($data->sn) ? $data->sn : "";
                $trx->note    = "Payment " . $trx->product_name . " " . $customer_no . " Success. SN/Ref : " . $trx->token;
                $trx->status  = Transaction::STAT_SUCCCESS;
            } elseif ($status == 'gagal') {
                if (preg_match('/(saldo|sedang.*gangguan)/i', $data->message)) {
                    $note = "Product in problem";
                } else {
                    $note = $data->message;
                }

                $user->refresh();
                $user->saldo    = $user->saldo + $productPrice;

                $trx->note      = $note . ". Saldo refund";
                $trx->status    = Transaction::STAT_FAILED;
            }

            $user->save();
            $trx->save();

            DB::commit();
        } catch (\Exception $e) {
            Log::error($e);
        }
    }
}

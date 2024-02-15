<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helper\DigiflazzHelper;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckTrxPrepaid extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trxprepaid:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check trx prepaid ';

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

        $waitingTransaction = Transaction::where('status', Transaction::STAT_PROCESS)
            ->where('created_at', '>=', Carbon::now()->subDays(80)->toDateTimeString())
            ->get();

        $df = new DigiflazzHelper();

        foreach ($waitingTransaction as $trx) {
            $jsonRes = $df->order($trx->id, $trx->code, $trx->sequence_id, $trx->target, $trx->mtrpln);
            $check = json_decode($jsonRes);

            if (empty($check->response->data)) {
                continue;
            }

            $data = $check->response->data;
            $status = strtolower($data->status);
            $is_pln = !empty(trim($trx->mtrpln, '-'));

            if ($trx->sequence_id > 1) {
                if ($data->customer_no != $trx->sequence_id . '.' . ($is_pln ? $trx->mtrpln : $trx->target)) {
                    continue;
                }
            }
            $trx->api_response = $jsonRes;

            try {
                $customer_no = explode('.', $data->customer_no);

                if (count($customer_no) > 1) {
                    if (preg_match('/^[\d]+$/i', $customer_no[0])) // if sequence detected
                    {
                        $sl = strlen($customer_no[0]) + 1;
                        $customer_no = substr($data->customer_no, $sl);
                    } else {
                        $customer_no = $data->customer_no;
                    }
                } else {
                    $customer_no = $data->customer_no;
                }

                $trx_id = $data->ref_id;
                $product_code = $data->buyer_sku_code;
                $sn = isset($data->sn) ? $data->sn : null;
                $customer_id = $is_pln ? $customer_no : NULL;
                $phone = $is_pln ? NULL : $customer_no;
                $note = $data->message;
                $user = $trx->user;
                
                if ($status == 'sukses') {
                    $trx->token = $sn;
                    $trx->note = "Trx $product_code " . ($is_pln ? $customer_id : $phone) . " Success SN : $sn";
                    $trx->status = Transaction::STAT_SUCCCESS;
                } elseif ($status == 'gagal' && $trx->status == Transaction::STAT_PROCESS) {
                    $hargaproduk = $trx->total;

                    $user->refresh();
                    $sisaSaldo = $user->saldo + $hargaproduk;
                    $user->saldo = $sisaSaldo;

                    $trx->note = (!preg_match('/saldo/i', $note) ? $note : 'Produk sedang gangguan') . ". Saldo dikembalikan";
                    $trx->status = Transaction::STAT_FAILED;
                }

                $user->save();
                $trx->save();
            } catch (\Throwable $th) {
                Log::error($th->getMessage());
            }
        }
    }
}

<?php

namespace App\Jobs;

use App\Helper\DigiflazzHelper;
use App\Models\Transaction;
use Carbon\Carbon;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class ProcessPrepaid implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $transaction;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $transaction = $this->transaction;
        if (!$transaction) return;

        $df = new DigiflazzHelper();

        try {
            $today = Carbon::today()->setTimeZone('Asia/Jakarta');

            $sequence = (int) Transaction::where('code', $transaction->code)
                ->where(function ($q) use ($transaction) {
                    $q->where('target', $transaction->target)
                        ->orWhere('mtrpln', $transaction->mtrpln);
                })
                ->whereBetween('created_at', [$today->format('Y-m-d H:i:s'), $today->addHours(24)->format('Y-m-d H:i:s')])
                ->count();

            $order = $df->order($transaction->id, $transaction->code, $sequence, $transaction->target, $transaction->mtrpln);

            $result = json_decode($order);
            $transaction->sequence  = $sequence;

            if ($result->success == false && $result->connected == false) {
                // if(preg_match('/(tidak support.*multi|saldo.*saldo.*cukup|Cut Off)/i',$result->message))
                // {
                //     throw new Exception('Tidak dapat diproses (1)',0);
                // }
                // else
                // {
                throw new Exception($result->message, 0);
                // }
            }

            if ($result->success == false && $result->connected == true) {
                // if(preg_match('/(tidak support.*multi|saldo.*cukup|seller.*gangguan|Cut Off)/i',$result->message))
                // {
                //     throw new Exception('Tidak dapat diproses (2)',0);
                // }
                // else
                // {
                throw new Exception($result->message, 1);
                // }
            }

            if (!is_null($result->response)) {
                $data =  $result->response->data;
                $status = strtolower($data->status);

                if ($status == 'gagal') {
                    // if(preg_match('/(tidak support.*multi|saldo.*cukup|Cut Off)/i',$data->message))
                    // {
                    //     throw new Exception('Tidak dapat diproses (3)',0);
                    // }
                    // else
                    // {
                    throw new Exception($data->message, 1);
                    // }
                }
            }
        } catch (Exception $e) {
            if ($e instanceof QueryException) {
                Log::error($e);
            }

            $transaction->status = Transaction::STAT_FAILED;
            $transaction->note   = 'Transaction ' . $transaction->product_name . ' ' . (!empty($transaction->mtrpln) ?  $transaction->mtrpln : $transaction->target) . ' Failed';
        }
        $transaction->save();
    }
}

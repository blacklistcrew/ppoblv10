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
            $today = Carbon::today();

            $sequence = (int) Transaction::where('code', $transaction->code)
                ->where(function ($q) use ($transaction) {
                    $q->where('target', $transaction->target)
                        ->orWhere('mtrpln', $transaction->mtrpln);
                })
                ->whereBetween('created_at', [$today->format('Y-m-d H:i:s'), $today->addHours(24)->format('Y-m-d H:i:s')])
                ->count();

            $order = $df->order($transaction->id, $transaction->code, $sequence, $transaction->target, $transaction->mtrpln);

            $transaction->api_response = $order;
            $transaction->sequence  = $sequence;
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

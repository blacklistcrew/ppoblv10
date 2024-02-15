<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helper\DigiflazzHelper;
use App\Models\Transaction;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckTrxPostpaid extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trxpostpaid:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cek Transaksi Pembayaran';

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
        Transaction::where('status', Transaction::STAT_WAITING_PAYMENT)
            ->where('created_at', '<=', Carbon::now()->subHours(2)->format('Y-m-d H:i:s'))
            ->update([
                'status' => Transaction::STAT_FAILED,
            ]);

        $waitingTransaction = Transaction::where('status', Transaction::STAT_PROCESS)->get();

        $df = new DigiflazzHelper();

        foreach ($waitingTransaction as $transaction) {
            DB::beginTransaction();
            try {
                $user = $transaction->user;

                $payBillJson = $df->payBill($transaction->id, $transaction->code, $transaction->sequence_id, $transaction->target);
                $payBill = json_decode($payBillJson);

                $payBill = $payBill->response->data;

                if (strtolower($payBill->status) == 'sukses') {
                    $transaction->token  =  $payBill->sn;
                    $transaction->note = 'Pay bill ' . $transaction->product_name . ' ' . $transaction->target . ' Period: ' . $transaction->note . ' - ' . $payBill->message;
                    $transaction->status = Transaction::STAT_SUCCCESS;
                } else {
                    $sisaSaldo = $user->saldo + $transaction->total;
                    $user->refresh();
                    $user->saldo = $sisaSaldo;

                    $transaction->note       = "Bill payment " . $transaction->product_name . ' failed';
                    $transaction->status     = Transaction::STAT_FAILED;
                }

                $user->save();
                $transaction->save();

                DB::commit();
            } catch (Exception $e) {
                DB::rollback();
                Log::error($e);
            }
        }
    }
}

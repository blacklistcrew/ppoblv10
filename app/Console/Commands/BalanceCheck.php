<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\AppModel\Setting;
use App\Helper\DigiflazzHelper;
use App\Models\MstSetting;

class BalanceCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'balance:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'FOR CHECKING SALDO';

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
        $df = new DigiflazzHelper();
        $cek = $df->balance();
        $cek = json_decode($cek);

        $cekAuthApi = isset($cek->connected) ? true : false;

        if ($cekAuthApi == true) {
            $status_server = MstSetting::first();

            if ($status_server) {
                if (@$cek->success === true) {
                    $status_server->balance = $cek->response->data->deposit;
                    $status_server->save();
                }
            } else {
                $m = new MstSetting();
                $m->balance = $cek->response->data->deposit;
                $m->status = 1;
                $m->save();
            }
        }
    }
}

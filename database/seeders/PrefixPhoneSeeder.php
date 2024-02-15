<?php

namespace Database\Seeders;

use App\Models\MstPrefixPhone;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PrefixPhoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $prefix_phones = array(
            array('name' => 'AXIS', 'prefix' => '0831,0832,0838'),
            array('name' => 'BOLT', 'prefix' => '998,999'),
            array('name' => 'CERIA', 'prefix' => '0828'),
            array('name' => 'INDOSAT', 'prefix' => '0856,0857,0858,0815,0816,0855,0814'),
            array('name' => 'SMARTFREN', 'prefix' => '0881,0882,0883,0884,0885,0886,0887,0888,0889'),
            array('name' => 'TELKOMSEL', 'prefix' => '0811,0812,0813,0821,0822,0823,0852,0853,0851'),
            array('name' => 'TRI', 'prefix' => '0896,0897,0898,0899,0895'),
            array('name' => 'XL', 'prefix' => '0817,0818,0819,0859,0877,0878'),
            array('name' => 'BY.U', 'prefix' => '0851')
        );

        $timestamp = Carbon::now();

        foreach ($prefix_phones as &$d) {
            $d['created_at'] = $timestamp;
            $d['updated_at'] = $timestamp;
        }

        MstPrefixPhone::insert($prefix_phones);
    }
}

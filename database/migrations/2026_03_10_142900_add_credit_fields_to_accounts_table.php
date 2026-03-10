<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->decimal('credit_limit', 12, 2)->nullable()->after('current_balance');
            $table->decimal('available_credit', 12, 2)->nullable()->after('credit_limit');
        });

        DB::table('accounts')
            ->where('type', 'credit_card')
            ->update([
                'credit_limit' => DB::raw('initial_balance'),
                'available_credit' => DB::raw('current_balance'),
                'initial_balance' => 0,
                'current_balance' => 0,
            ]);
    }

    public function down(): void
    {
        DB::table('accounts')
            ->where('type', 'credit_card')
            ->update([
                'initial_balance' => DB::raw('credit_limit'),
                'current_balance' => DB::raw('available_credit'),
            ]);

        Schema::table('accounts', function (Blueprint $table) {
            $table->dropColumn([
                'credit_limit',
                'available_credit',
            ]);
        });
    }
};

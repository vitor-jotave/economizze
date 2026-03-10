<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('transactions', 'description')) {
            return;
        }

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['description', 'notes']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('transactions', 'description')) {
            return;
        }

        Schema::table('transactions', function (Blueprint $table) {
            $table->string('description')->nullable();
            $table->text('notes')->nullable();
        });
    }
};

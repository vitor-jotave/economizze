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
        Schema::create('system_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type', 80);
            $table->string('title');
            $table->text('body');
            $table->string('tone', 120);
            $table->string('subject_type', 50)->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('period_key', 20)->nullable();
            $table->string('threshold_key', 40)->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('telegram_sent_at')->nullable();
            $table->timestamps();

            $table->unique([
                'type',
                'subject_type',
                'subject_id',
                'period_key',
                'threshold_key',
            ], 'system_notifications_unique_budget_alert');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_notifications');
    }
};

<?php

namespace App\Services;

use App\Models\SystemNotification;
use Illuminate\Support\Facades\Http;
use Throwable;

class TelegramNotificationService
{
    public function send(SystemNotification $notification): bool
    {
        if (! $this->isConfigured() || $notification->telegram_sent_at !== null) {
            return false;
        }

        try {
            $response = Http::asForm()->post($this->endpoint(), [
                'chat_id' => (string) config('services.telegram.chat_id'),
                'text' => $this->messageFor($notification),
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => 'true',
            ]);
        } catch (Throwable) {
            return false;
        }

        if (! $response->successful()) {
            return false;
        }

        $notification->forceFill([
            'telegram_sent_at' => now(),
        ])->save();

        return true;
    }

    public function isConfigured(): bool
    {
        return filled(config('services.telegram.bot_token'))
            && filled(config('services.telegram.chat_id'));
    }

    protected function endpoint(): string
    {
        return sprintf(
            '%s/bot%s/sendMessage',
            rtrim((string) config('services.telegram.base_url', 'https://api.telegram.org'), '/'),
            (string) config('services.telegram.bot_token'),
        );
    }

    protected function messageFor(SystemNotification $notification): string
    {
        $payload = is_array($notification->payload) ? $notification->payload : [];
        $categoryName = (string) ($payload['category_name'] ?? 'Categoria');
        $spentAmount = $this->currency((float) ($payload['spent_amount'] ?? 0));
        $limitAmount = $this->currency((float) ($payload['limit_amount'] ?? 0));
        $progressPercentage = (float) ($payload['progress_percentage'] ?? 0);
        $statusLabel = $notification->threshold_key === 'limit_exceeded'
            ? '🚨 LIMITE EXCEDIDO 🚨'
            : '🚨 CHEGANDO NO LIMITE, CUIDADO 🚨';

        return implode("\n", [
            "<b>{$statusLabel}</b>",
            '',
            "<b>Categoria</b>: {$categoryName}",
            "<b>Progresso</b>: {$progressPercentage}%",
            "<b>Gasto no mês</b>: {$spentAmount}",
            "<b>Limite mensal</b>: {$limitAmount}",
            '',
            $notification->body,
        ]);
    }

    protected function currency(float $amount): string
    {
        return 'R$ '.number_format($amount, 2, ',', '.');
    }
}

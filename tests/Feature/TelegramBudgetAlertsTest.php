<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\SystemNotification;
use Illuminate\Support\Facades\Http;

it('sends the category budget alert to telegram when the service is configured', function () {
    config()->set('services.telegram.bot_token', 'token-123');
    config()->set('services.telegram.chat_id', 'chat-456');

    Http::fake([
        'https://api.telegram.org/*' => Http::response([
            'ok' => true,
        ], 200),
    ]);

    $account = Account::factory()->create([
        'type' => 'checking',
    ]);
    $category = Category::factory()->create([
        'name' => 'Internet',
        'type' => 'expense',
        'monthly_budget_limit' => 200,
    ]);

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 180,
        'transacted_at' => '2026-03-10',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    Http::assertSent(function ($request) {
        $data = $request->data();

        return str_contains($request->url(), '/bottoken-123/sendMessage')
            && ($data['chat_id'] ?? null) === 'chat-456'
            && ($data['parse_mode'] ?? null) === 'HTML'
            && str_contains((string) ($data['text'] ?? ''), '<b>🚨 CHEGANDO NO LIMITE, CUIDADO 🚨</b>')
            && str_contains((string) ($data['text'] ?? ''), '<b>Categoria</b>: Internet')
            && str_contains((string) ($data['text'] ?? ''), '<b>Progresso</b>: 90%');
    });

    expect(
        SystemNotification::query()
            ->where('subject_type', 'category')
            ->where('subject_id', $category->id)
            ->first()?->telegram_sent_at,
    )->not->toBeNull();
});

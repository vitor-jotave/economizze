<?php

namespace App\Services;

use App\Models\Category;
use App\Models\SystemNotification;
use Carbon\Carbon;
use Carbon\CarbonInterface;

class CategoryBudgetAlertService
{
    public const WARNING_PERCENTAGE = 80;

    public function __construct(
        protected TelegramNotificationService $telegramNotificationService,
    ) {}

    public function evaluateForMonth(
        int|Category|null $category,
        CarbonInterface|string|null $referenceDate,
    ): void {
        $resolvedCategory = $category instanceof Category
            ? $category
            : Category::query()->find($category);

        if (! $resolvedCategory instanceof Category) {
            return;
        }

        $budgetLimit = (float) ($resolvedCategory->monthly_budget_limit ?? 0);

        if ($budgetLimit <= 0 || $resolvedCategory->type === 'income') {
            return;
        }

        $date = $referenceDate instanceof CarbonInterface
            ? $referenceDate
            : Carbon::parse((string) $referenceDate);
        $windowStart = $date->copy()->startOfMonth();
        $windowEnd = $date->copy()->endOfMonth();
        $spentAmount = (float) $resolvedCategory->transactions()
            ->where('type', 'expense')
            ->whereBetween('transacted_at', [$windowStart, $windowEnd])
            ->sum('amount');
        $progressPercentage = $budgetLimit > 0
            ? round(($spentAmount / $budgetLimit) * 100, 1)
            : 0.0;

        if ($progressPercentage < self::WARNING_PERCENTAGE) {
            return;
        }

        $thresholdKey = $progressPercentage >= 100
            ? 'limit_exceeded'
            : 'warning';
        $isExceeded = $thresholdKey === 'limit_exceeded';
        $periodKey = $windowStart->format('Y-m');
        $limitLabel = number_format($budgetLimit, 2, ',', '.');
        $spentLabel = number_format($spentAmount, 2, ',', '.');
        $notification = SystemNotification::query()->firstOrCreate(
            [
                'user_id' => $resolvedCategory->user_id,
                'type' => 'category_budget_alert',
                'subject_type' => 'category',
                'subject_id' => $resolvedCategory->id,
                'period_key' => $periodKey,
                'threshold_key' => $thresholdKey,
            ],
            [
                'title' => $isExceeded
                    ? sprintf('%s ultrapassou o limite mensal.', $resolvedCategory->name)
                    : sprintf('%s está perto do limite mensal.', $resolvedCategory->name),
                'body' => $isExceeded
                    ? "A categoria ja consumiu R$ {$spentLabel} de um limite de R$ {$limitLabel} neste mes."
                    : "A categoria ja consumiu {$progressPercentage}% do limite mensal. Gasto atual: R$ {$spentLabel} de R$ {$limitLabel}.",
                'tone' => $isExceeded
                    ? 'from-[#F95555] to-[#F58A55]'
                    : 'from-[#F9D955] to-[#F59E55]',
                'payload' => [
                    'category_name' => $resolvedCategory->name,
                    'spent_amount' => round($spentAmount, 2),
                    'limit_amount' => round($budgetLimit, 2),
                    'progress_percentage' => $progressPercentage,
                ],
            ],
        );

        if ($notification->wasRecentlyCreated) {
            $this->telegramNotificationService->send($notification);
        }
    }
}

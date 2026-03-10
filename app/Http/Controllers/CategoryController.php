<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Activity;
use App\Models\Category;
use App\Services\CategoryBudgetAlertService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryBudgetAlertService $categoryBudgetAlertService,
    ) {}

    public function index(): Response
    {
        $categories = Category::query()
            ->ordered()
            ->get()
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'type' => $category->type,
                'type_label' => Category::TYPES[$category->type] ?? $category->type,
                'color' => $category->color,
                'icon' => $category->icon,
                'monthly_budget_limit' => (float) ($category->monthly_budget_limit ?? 0),
                'is_active' => $category->is_active,
                'updated_at' => $category->updated_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('categories', [
            'categories' => $categories,
            'categoryTypes' => collect(Category::TYPES)
                ->map(fn (string $label, string $value): array => [
                    'value' => $value,
                    'label' => $label,
                ])
                ->values(),
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        $category = Category::query()->create($this->validatedAttributes($request));

        $this->categoryBudgetAlertService->evaluateForMonth($category, now());

        $this->logActivity(
            type: 'category_created',
            title: sprintf('Categoria "%s" criada.', $category->name),
            tone: 'from-[#B5F955] to-[#6BE675]',
            category: $category,
        );

        return to_route('categories.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => 'Categoria criada com sucesso.',
        ]);
    }

    public function update(
        CategoryRequest $request,
        Category $category,
    ): RedirectResponse {
        $category->update($this->validatedAttributes($request));

        $this->categoryBudgetAlertService->evaluateForMonth($category, now());

        $this->logActivity(
            type: 'category_updated',
            title: sprintf('Categoria "%s" atualizada.', $category->name),
            tone: 'from-sky-400 to-blue-200',
            category: $category,
        );

        return to_route('categories.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => 'Categoria atualizada com sucesso.',
        ]);
    }

    public function destroy(Category $category): RedirectResponse
    {
        $categoryName = $category->name;

        $category->delete();

        Activity::query()->create([
            'type' => 'category_deleted',
            'title' => sprintf('Categoria "%s" removida.', $categoryName),
            'tone' => 'from-amber-300 to-orange-100',
            'subject_type' => 'category',
        ]);

        return to_route('categories.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => 'Categoria removida com sucesso.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validatedAttributes(CategoryRequest $request): array
    {
        /** @var array{name:string,type:string,color:string,icon:string,monthly_budget_limit?:numeric-string|int|float|null} $validated */
        $validated = $request->validated();

        return [
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'type' => $validated['type'],
            'color' => strtoupper($validated['color']),
            'icon' => $validated['icon'],
            'monthly_budget_limit' => in_array($validated['type'], ['expense', 'both'], true)
                && filled($validated['monthly_budget_limit'] ?? null)
                ? (float) str_replace(',', '.', (string) $validated['monthly_budget_limit'])
                : null,
            'is_active' => $request->route('category') instanceof Category
                ? $request->route('category')->is_active
                : true,
        ];
    }

    protected function logActivity(
        string $type,
        string $title,
        string $tone,
        Category $category,
    ): void {
        Activity::query()->create([
            'type' => $type,
            'title' => $title,
            'tone' => $tone,
            'subject_type' => 'category',
            'subject_id' => $category->id,
        ]);
    }
}

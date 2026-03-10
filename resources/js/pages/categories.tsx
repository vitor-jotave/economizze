import { useForm, usePage } from '@inertiajs/react';
import { useDeferredValue, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
    destroy as destroyCategory,
    store as storeCategory,
    update as updateCategory,
} from '@/actions/App/Http/Controllers/CategoryController';
import AppButton from '@/components/app-button';
import CategoryIconGlyph from '@/components/category-icon-glyph';
import type {
    CategoriesPageProps,
    Category,
    CategoryFormData,
} from '@/types/categories';
import CategoryComposerModal from './category-composer-modal';
import Layout from './layout';

const defaultForm: CategoryFormData = {
    name: '',
    type: 'expense',
    color: '#B5F955',
    icon: 'receipt',
};

export default function Categories(): ReactElement {
    const { categories, categoryTypes } = usePage<CategoriesPageProps>().props;
    const [search, setSearch] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const deferredSearch = useDeferredValue(search);
    const form = useForm<CategoryFormData>(defaultForm);

    const filteredCategories = useMemo(() => {
        const normalizedSearch = deferredSearch.trim().toLowerCase();

        if (normalizedSearch.length === 0) {
            return categories;
        }

        return categories.filter((category) =>
            [category.name, category.type_label, category.icon, category.slug]
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearch),
        );
    }, [categories, deferredSearch]);

    function resetForm(closeComposer = false): void {
        setEditingCategory(null);
        form.reset();
        form.setData(defaultForm);
        form.clearErrors();

        if (closeComposer) {
            setIsComposerOpen(false);
        }
    }

    function openCreateFlow(): void {
        resetForm();
        setIsComposerOpen(true);
    }

    function fillForEdit(category: Category): void {
        setEditingCategory(category);
        setIsComposerOpen(true);
        form.setData({
            name: category.name,
            type: category.type,
            color: category.color,
            icon: category.icon,
        });
    }

    function submitForm(): void {
        form.submit(
            editingCategory
                ? updateCategory(editingCategory.id)
                : storeCategory(),
            {
                preserveScroll: true,
                onSuccess: () => resetForm(true),
            },
        );
    }

    function removeCategory(category: Category): void {
        if (pendingDeleteId !== category.id) {
            setPendingDeleteId(category.id);

            window.setTimeout(() => {
                setPendingDeleteId((current) =>
                    current === category.id ? null : current,
                );
            }, 3200);

            return;
        }

        form.submit(destroyCategory(category.id), {
            preserveScroll: true,
            onSuccess: () => {
                setPendingDeleteId(null);

                if (editingCategory?.id === category.id) {
                    resetForm(true);
                }
            },
        });
    }

    return (
        <Layout currentPage="categories" title="Categories">
            <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="font-mono text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                            Categorias
                        </h1>
                        <p className="mt-3 max-w-155 text-[16px] leading-6 text-[#8B93A0]">
                            Estruture suas despesas e receitas usando a
                            segmentação inteligente.
                        </p>
                    </div>

                    <AppButton
                        type="button"
                        onClick={openCreateFlow}
                        variant="lime"
                        className="px-5 text-[14px]"
                    >
                        Nova Categoria
                    </AppButton>
                </div>

                <section className="overflow-hidden rounded-[26px] border border-[#1B212C] bg-[#0C1016]">
                    <div className="flex flex-col gap-4 border-b border-[#171C24] px-6 py-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="mt-1 text-[14px] text-[#6E7683]">
                                {filteredCategories.length} categoria(s)
                                listada(s)
                            </p>
                        </div>

                        <div className="relative w-full md:max-w-[280px]">
                            <svg
                                viewBox="0 0 24 24"
                                className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#727986]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle cx="11" cy="11" r="6" />
                                <path d="m20 20-3.5-3.5" />
                            </svg>
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Pesquisar..."
                                className="h-12 w-full rounded-2xl border border-[#181D25] bg-[#13171E] pr-4 pl-11 text-[15px] text-white outline-none placeholder:text-[#727986]"
                            />
                        </div>
                    </div>

                    {filteredCategories.length === 0 ? (
                        <div className="px-6 py-12 text-center text-[15px] text-[#7F8794]">
                            Nenhuma categoria encontrada com esse filtro.
                        </div>
                    ) : (
                        <div className="grid gap-px bg-[#171C24] md:grid-cols-2 xl:grid-cols-3">
                            {filteredCategories.map((category) => {
                                const isPendingDelete =
                                    pendingDeleteId === category.id;

                                return (
                                    <article
                                        key={category.id}
                                        className="bg-[#0C1016] p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className="flex h-14 w-14 items-center justify-center rounded-[20px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                                                    style={{
                                                        backgroundColor:
                                                            category.color,
                                                    }}
                                                >
                                                    <CategoryIconGlyph
                                                        icon={category.icon}
                                                        className="h-6 w-6"
                                                    />
                                                </span>
                                                <div>
                                                    <p className="text-[20px] font-medium text-white">
                                                        {category.name}
                                                    </p>
                                                    <p className="mt-1 text-[14px] text-[#7D848F]">
                                                        {category.type_label}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* <span className="rounded-full border border-[#212734] bg-[#121822] px-3 py-1 text-[12px] tracking-[0.12em] text-[#A4ACB8] uppercase">
                                                {category.icon}
                                            </span> */}
                                        </div>

                                        <div className="mt-8 flex items-center justify-between gap-3">
                                            <p className="text-[13px] text-[#6E7683]">
                                                Atualizada em{' '}
                                                {category.updated_at ??
                                                    'agora mesmo'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fillForEdit(category)
                                                    }
                                                    className="rounded-full border border-[#23303D] px-3 py-2 text-[13px] text-[#D7DCE4] transition hover:border-[#38495D]"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCategory(category)
                                                    }
                                                    className={[
                                                        'rounded-full border px-3 py-2 text-[13px] transition',
                                                        isPendingDelete
                                                            ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                                            : 'border-[#3D2323] text-[#FFB6B6] hover:border-[#6A3434]',
                                                    ].join(' ')}
                                                >
                                                    {isPendingDelete
                                                        ? 'Confirmar'
                                                        : 'Excluir'}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            <CategoryComposerModal
                isOpen={isComposerOpen}
                editingCategory={
                    editingCategory
                        ? {
                              id: editingCategory.id,
                              name: editingCategory.name,
                          }
                        : null
                }
                categoryTypes={categoryTypes}
                data={form.data}
                errors={form.errors}
                processing={form.processing}
                onClose={() => resetForm(true)}
                onSubmit={submitForm}
                setField={(field, value) =>
                    form.setData(field, value as CategoryFormData[typeof field])
                }
            />
        </Layout>
    );
}

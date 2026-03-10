import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import AppButton from '@/components/app-button';
import CategoryIconGlyph from '@/components/category-icon-glyph';
import { categoryColorPresets, categoryIconOptions } from '@/lib/categories';
import { hexToRgb, normalizeHexColor } from '@/lib/utils';
import type { CategoryFormData, CategoryTypeOption } from '@/types/categories';

type CategoryFormErrors = Partial<Record<keyof CategoryFormData, string>>;
type CategoryFormValue = CategoryFormData[keyof CategoryFormData];

type EditingCategory = {
    id: number;
    name: string;
};

export default function CategoryComposerModal({
    isOpen,
    editingCategory,
    categoryTypes,
    data,
    errors,
    processing,
    onClose,
    onSubmit,
    setField,
}: {
    isOpen: boolean;
    editingCategory: EditingCategory | null;
    categoryTypes: CategoryTypeOption[];
    data: CategoryFormData;
    errors: CategoryFormErrors;
    processing: boolean;
    onClose: () => void;
    onSubmit: () => void;
    setField: (field: keyof CategoryFormData, value: CategoryFormValue) => void;
}): ReactElement {
    const [isExitPromptOpen, setIsExitPromptOpen] = useState(false);
    const previewColor = normalizeHexColor(data.color);
    const previewColorRgb = hexToRgb(previewColor);
    const selectedTypeLabel = useMemo(
        () =>
            categoryTypes.find((type) => type.value === data.type)?.label ??
            'Categoria',
        [categoryTypes, data.type],
    );

    useEffect(() => {
        if (!isOpen) {
            setIsExitPromptOpen(false);
        }
    }, [isOpen]);

    function requestClose(): void {
        setIsExitPromptOpen(true);
    }

    function confirmClose(): void {
        setIsExitPromptOpen(false);
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen ? (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close category modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-[rgba(3,6,10,0.74)] backdrop-blur-md"
                        onClick={requestClose}
                    />

                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-6 sm:px-6 lg:py-10"
                        onClick={requestClose}
                    >
                        <motion.section
                            onClick={(event) => event.stopPropagation()}
                            initial={{ opacity: 0, y: 36, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 28, scale: 0.98 }}
                            transition={{
                                type: 'spring',
                                stiffness: 220,
                                damping: 24,
                            }}
                            className="relative w-full max-w-[980px] overflow-hidden rounded-[34px] border border-[#1B212C] bg-[#11161D] shadow-[0_40px_120px_rgba(0,0,0,0.48)]"
                        >
                            <AnimatePresence>
                                {isExitPromptOpen ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -14 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-b border-[#2A2121] bg-[linear-gradient(180deg,rgba(72,18,18,0.36),rgba(32,12,12,0.22))] px-6 py-4 sm:px-8"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-[13px] tracking-[0.14em] text-[#F0B4B4] uppercase">
                                                    Sair do Cadastro
                                                </p>
                                                <p className="mt-2 text-[15px] text-[#F7DEDE]">
                                                    Deseja sair do cadastro
                                                    desta categoria? Os dados
                                                    atuais serao descartados.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <AppButton
                                                    type="button"
                                                    onClick={() =>
                                                        setIsExitPromptOpen(
                                                            false,
                                                        )
                                                    }
                                                    variant="dark"
                                                    className="h-11 px-4 text-[14px]"
                                                >
                                                    Continuar
                                                </AppButton>
                                                <AppButton
                                                    type="button"
                                                    onClick={confirmClose}
                                                    variant="lime"
                                                    className="h-11 px-4 text-[14px]"
                                                >
                                                    Fechar
                                                </AppButton>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <div className="grid gap-0 lg:grid-cols-[420px_minmax(0,1fr)]">
                                <div className="relative overflow-hidden border-b border-[#1B212C] p-6 sm:p-8 lg:border-r lg:border-b-0">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `radial-gradient(circle at top left, rgba(${previewColorRgb}, 0.34), transparent 52%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))`,
                                        }}
                                    />
                                    <div className="relative space-y-6">
                                        <div>
                                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                {editingCategory
                                                    ? 'Editando Categoria'
                                                    : 'Nova Categoria'}
                                            </p>
                                            <h2 className="mt-3 font-mono text-[32px] leading-none font-medium tracking-[-0.05em] text-white">
                                                {editingCategory
                                                    ? editingCategory.name
                                                    : data.name ||
                                                      'Cadastre uma nova categoria.'}
                                            </h2>
                                            <p className="mt-3 max-w-70 text-[15px] leading-6 text-[#A4ACB8]">
                                                Defina o tipo, a cor e o icone
                                                para identificar essa categoria
                                                com clareza.
                                            </p>
                                        </div>

                                        <div
                                            className="relative overflow-hidden rounded-[30px] border border-white/8 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)]"
                                            style={{
                                                background: `linear-gradient(145deg, rgba(${previewColorRgb}, 0.44), rgba(17,22,29,0.2))`,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
                                            <div className="relative space-y-10">
                                                <div className="flex items-center justify-between">
                                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] tracking-[0.14em] text-white/85 uppercase">
                                                        {selectedTypeLabel}
                                                    </span>
                                                    <span className="text-[12px] tracking-[0.18em] text-white/70 uppercase">
                                                        Preview
                                                    </span>
                                                </div>

                                                <div className="flex items-end justify-between">
                                                    <div className="space-y-3">
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/15 bg-[rgba(8,10,14,0.24)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                                                            <CategoryIconGlyph
                                                                icon={data.icon}
                                                                className="h-8 w-8"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-[27px] leading-none font-semibold tracking-[-0.04em] text-white">
                                                                {data.name ||
                                                                    'Nome da categoria'}
                                                            </p>
                                                            <p className="mt-2 pr-10 text-[14px] text-white/70">
                                                                Organize suas
                                                                movimentacoes
                                                                com contexto
                                                                visual.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <div className="grid gap-5">
                                        <div>
                                            <label className="mb-2 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                Nome
                                            </label>
                                            <input
                                                value={data.name}
                                                onChange={(event) =>
                                                    setField(
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Ex: Mercado, Farmacia..."
                                                className="h-[52px] w-full rounded-[20px] border border-[#232A35] bg-[#141922] px-4 text-[15px] text-white outline-none placeholder:text-[#69717E]"
                                            />
                                            {errors.name ? (
                                                <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                    {errors.name}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="mb-3 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                Tipo
                                            </label>
                                            <div className="grid gap-3 sm:grid-cols-3">
                                                {categoryTypes.map((type) => {
                                                    const isActive =
                                                        data.type ===
                                                        type.value;

                                                    return (
                                                        <button
                                                            key={type.value}
                                                            type="button"
                                                            onClick={() =>
                                                                setField(
                                                                    'type',
                                                                    type.value,
                                                                )
                                                            }
                                                            className={[
                                                                'rounded-[22px] border px-4 py-4 text-left transition',
                                                                isActive
                                                                    ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                                                    : 'border-[#232A35] bg-[#141922] text-[#D5DCE6] hover:border-[#303948] hover:bg-[#171D27]',
                                                            ].join(' ')}
                                                        >
                                                            <p className="text-[16px] font-medium">
                                                                {type.label}
                                                            </p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {errors.type ? (
                                                <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                    {errors.type}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="mb-3 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                Cor
                                            </label>
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                {categoryColorPresets.map(
                                                    (preset) => {
                                                        const isActive =
                                                            normalizeHexColor(
                                                                data.color,
                                                            ) === preset;

                                                        return (
                                                            <button
                                                                key={preset}
                                                                type="button"
                                                                onClick={() =>
                                                                    setField(
                                                                        'color',
                                                                        preset,
                                                                    )
                                                                }
                                                                className={[
                                                                    'relative h-9 w-9 rounded-full border transition',
                                                                    isActive
                                                                        ? 'scale-110 border-white/80'
                                                                        : 'border-white/10 hover:scale-105 hover:border-white/25',
                                                                ].join(' ')}
                                                                style={{
                                                                    backgroundColor:
                                                                        preset,
                                                                }}
                                                            >
                                                                {isActive ? (
                                                                    <span className="absolute inset-0 rounded-full border border-white/55" />
                                                                ) : null}
                                                            </button>
                                                        );
                                                    },
                                                )}
                                                <div className="relative ml-2 overflow-hidden rounded-full border border-[#232A35] bg-[#141922]">
                                                    <input
                                                        type="color"
                                                        value={previewColor}
                                                        onChange={(event) =>
                                                            setField(
                                                                'color',
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        className="h-9 w-11 cursor-pointer opacity-0"
                                                    />
                                                    <div
                                                        className="pointer-events-none absolute inset-1 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                previewColor,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {errors.color ? (
                                                <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                    {errors.color}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <label className="mb-3 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                Icone
                                            </label>
                                            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                                                {categoryIconOptions.map(
                                                    (option) => {
                                                        const isActive =
                                                            data.icon ===
                                                            option.value;

                                                        return (
                                                            <button
                                                                key={
                                                                    option.value
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    setField(
                                                                        'icon',
                                                                        option.value,
                                                                    )
                                                                }
                                                                aria-label={
                                                                    option.label
                                                                }
                                                                className={[
                                                                    'flex h-13 items-center justify-center rounded-[22px] border transition',
                                                                    isActive
                                                                        ? 'border-[#B5F955] bg-[#18210D] text-white shadow-[0_16px_32px_rgba(181,249,85,0.12)]'
                                                                        : 'border-[#232A35] bg-[#141922] text-[#D5DCE6] hover:border-[#303948] hover:bg-[#171D27]',
                                                                ].join(' ')}
                                                            >
                                                                <span className="flex items-center justify-center rounded-2xl">
                                                                    <CategoryIconGlyph
                                                                        icon={
                                                                            option.value
                                                                        }
                                                                        className="h-5 w-5"
                                                                    />
                                                                </span>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                            {errors.icon ? (
                                                <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                    {errors.icon}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-col-reverse gap-3 border-t border-[#1B212C] pt-6 sm:flex-row sm:items-center sm:justify-end">
                                            <AppButton
                                                type="button"
                                                onClick={requestClose}
                                                variant="lime"
                                                className="px-5"
                                            >
                                                Fechar
                                            </AppButton>
                                            <AppButton
                                                type="button"
                                                onClick={onSubmit}
                                                loading={processing}
                                                variant="dark"
                                                className="px-5"
                                            >
                                                {editingCategory
                                                    ? 'Salvar categoria'
                                                    : 'Criar categoria'}
                                            </AppButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </>
            ) : null}
        </AnimatePresence>
    );
}

import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatBrazilianCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

export function getLocalDateInputValue(date = new Date()): string {
    const timezoneOffset = date.getTimezoneOffset() * 60_000;

    return new Date(date.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10);
}

export function normalizeHexColor(color: string): string {
    return /^#[A-Fa-f0-9]{6}$/.test(color) ? color.toUpperCase() : '#B5F955';
}

export function hexToRgb(color: string): string {
    const normalizedColor = normalizeHexColor(color).replace('#', '');
    const red = Number.parseInt(normalizedColor.slice(0, 2), 16);
    const green = Number.parseInt(normalizedColor.slice(2, 4), 16);
    const blue = Number.parseInt(normalizedColor.slice(4, 6), 16);

    return `${red}, ${green}, ${blue}`;
}

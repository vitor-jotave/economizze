import type { ReactElement } from 'react';

export default function CategoryIconGlyph({
    icon,
    className = 'h-5 w-5',
}: {
    icon: string;
    className?: string;
}): ReactElement {
    if (icon === 'car') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M5 16h14" />
                <path d="M7 16l1.5-5h7L17 16" />
                <path d="M6 16v2" />
                <path d="M18 16v2" />
                <circle
                    cx="8"
                    cy="16.5"
                    r="1.5"
                    fill="currentColor"
                    stroke="none"
                />
                <circle
                    cx="16"
                    cy="16.5"
                    r="1.5"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        );
    }

    if (icon === 'bus') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="6" y="4.5" width="12" height="12" rx="3" />
                <path d="M6 10.5h12" />
                <path d="M8 16.5v2" />
                <path d="M16 16.5v2" />
                <circle
                    cx="9"
                    cy="16.5"
                    r="1.2"
                    fill="currentColor"
                    stroke="none"
                />
                <circle
                    cx="15"
                    cy="16.5"
                    r="1.2"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        );
    }

    if (icon === 'utensils') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M7 3v8" />
                <path d="M5 3v5" />
                <path d="M9 3v5" />
                <path d="M7 11v10" />
                <path d="M15 3c1.7 2 2.5 4.3 2.5 7V21" />
                <path d="M15 3v18" />
            </svg>
        );
    }

    if (icon === 'home') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M4 10.5 12 4l8 6.5" />
                <path d="M6 9.5V20h12V9.5" />
                <path d="M10 20v-5h4v5" />
            </svg>
        );
    }

    if (icon === 'smartphone') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="7" y="3" width="10" height="18" rx="2.5" />
                <path d="M10.5 6h3" />
                <circle
                    cx="12"
                    cy="17.5"
                    r="0.9"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        );
    }

    if (icon === 'wifi') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M4.5 9.5a11.5 11.5 0 0 1 15 0" />
                <path d="M7.5 12.5a7.5 7.5 0 0 1 9 0" />
                <path d="M10.5 15.5a3.5 3.5 0 0 1 3 0" />
                <circle
                    cx="12"
                    cy="19"
                    r="1.2"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        );
    }

    if (icon === 'heart') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M12 20s-6.5-4.3-8.3-8a4.7 4.7 0 0 1 8.3-4 4.7 4.7 0 0 1 8.3 4C18.5 15.7 12 20 12 20Z" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M7 4h10l2 3v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7l2-3Z" />
            <path d="M9 10h6" />
            <path d="M9 14h6" />
        </svg>
    );
}

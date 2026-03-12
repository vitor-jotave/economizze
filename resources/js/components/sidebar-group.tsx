import { Link } from '@inertiajs/react';
import type { ReactElement } from 'react';
import type { NavigationItem } from '@/types/navigation';

type SidebarGroupProps = {
    title: string;
    items: NavigationItem[];
    onNavigate?: () => void;
};

export default function SidebarGroup({
    title,
    items,
    onNavigate,
}: SidebarGroupProps): ReactElement {
    return (
        <div className="space-y-3">
            <p className="px-2 text-[12px] font-semibold tracking-[0.22em] text-[#5E626B] uppercase">
                {title}
            </p>
            <div className="space-y-1">
                {items.map((item) => {
                    const className = [
                        'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] transition',
                        item.active
                            ? 'bg-[#B5F955] text-[#0A0D09] shadow-[0_8px_20px_rgba(181,249,85,0.22)]'
                            : 'text-[#777C85] hover:bg-[#13171E] hover:text-[#E8EDF3]',
                        item.dimmed ? 'opacity-60' : '',
                    ].join(' ');

                    const content = (
                        <>
                            <span
                                className={[
                                    'flex h-5 w-5 items-center justify-center',
                                    item.active
                                        ? 'text-[#0A0D09]'
                                        : 'text-[#5E626B]',
                                ].join(' ')}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </>
                    );

                    if (item.href) {
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={className}
                                onClick={onNavigate}
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.label}
                            type="button"
                            className={className}
                            onClick={onNavigate}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

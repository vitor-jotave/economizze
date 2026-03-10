import { usePage } from '@inertiajs/react';
import { AnimatePresence } from 'motion/react';
import AppToast from '@/components/app-toast';
import type {
    NotificationCenterActivity,
    NotificationCenterItem,
} from '@/types/notification-center';
import type { ReactElement, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import NotificationsPanel from './notifications-panel';
import Sidebar from './sidebar';
import Topbar from './topbar';

export default function Layout({
    children,
    currentPage,
    title,
}: {
    children: ReactNode;
    currentPage:
        | 'dashboard'
        | 'accounts'
        | 'categories'
        | 'transactions'
        | 'reports';
    title: string;
}): ReactElement {
    const { flash, notificationCenter } = usePage<{
        flash?: {
            success?: {
                id: string;
                message: string;
            } | null;
        };
        notificationCenter?: {
            activities?: NotificationCenterActivity[];
        };
    }>().props;
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [recentNotifications, setRecentNotifications] = useState<
        NotificationCenterItem[]
    >([]);
    const lastFlashIdRef = useRef<string | null>(null);

    useEffect(() => {
        const success = flash?.success;

        if (!success?.message || success.id === lastFlashIdRef.current) {
            return;
        }

        const notification: NotificationCenterItem = {
            id: success.id,
            title: success.message,
            time: 'Agora mesmo',
        };

        lastFlashIdRef.current = success.id;
        setRecentNotifications((current) =>
            [notification, ...current].slice(0, 8),
        );

        const timeout = window.setTimeout(() => {
            setRecentNotifications((current) =>
                current.filter((item) => item.id !== notification.id),
            );
        }, 4200);

        return () => window.clearTimeout(timeout);
    }, [flash?.success]);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#45D86F_0%,_#31CF79_28%,_#55E2B3_58%,_#3FD977_100%)] text-white">
            <div className="min-h-screen bg-[rgba(5,8,12,0.96)]">
                <div className="min-h-screen xl:pl-[280px]">
                    <Sidebar currentPage={currentPage} />
                    <Topbar
                        title={title}
                        isNotificationsOpen={isNotificationsOpen}
                        onToggleNotifications={() =>
                            setIsNotificationsOpen((current) => !current)
                        }
                    />
                    <div className="min-h-screen px-8 py-[115px]">
                        {children}
                    </div>
                </div>
            </div>
            <div className="pointer-events-none fixed top-6 right-6 z-45 flex w-full max-w-[360px] flex-col gap-3">
                <AnimatePresence>
                    {recentNotifications.map((notification) => (
                        <AppToast
                            key={notification.id}
                            title={notification.title}
                        />
                    ))}
                </AnimatePresence>
            </div>
            <NotificationsPanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                recentNotifications={recentNotifications}
                activities={notificationCenter?.activities ?? []}
            />
        </div>
    );
}

import type { ReactElement, ReactNode } from 'react';
import Sidebar from './sidebar';

export default function Layout({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#45D86F_0%,_#31CF79_28%,_#55E2B3_58%,_#3FD977_100%)] text-white">
            <div className="min-h-screen bg-[rgba(5,8,12,0.96)]">
                <div className="min-h-screen xl:pl-[280px]">
                    <Sidebar />
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
}

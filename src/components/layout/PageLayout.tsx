import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';

interface PageLayoutProps {
    children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <Sidebar />
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                {children}
            </div>
        </div>
    );
}

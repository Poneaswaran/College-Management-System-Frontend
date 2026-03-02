import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';

interface PageLayoutProps {
    children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    const { isCollapsed, toggleMobile } = useSidebar();

    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <Sidebar />

            {/* Main content area */}
            <div className={[
                'flex-1 flex flex-col min-w-0 transition-all duration-300',
                // Desktop: offset by sidebar width
                isCollapsed ? 'lg:ml-20' : 'lg:ml-64',
            ].join(' ')}>
                {/* Mobile top bar — only visible on mobile */}
                <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-[var(--color-card)] border-b border-[var(--color-border)] shrink-0">
                    <button
                        onClick={toggleMobile}
                        className="p-2 -ml-1 rounded-lg hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground-secondary)] transition-colors"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="w-6 h-6 bg-[var(--color-primary)] rounded flex items-center justify-center text-white shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                    </div>
                    <span className="font-bold text-sm text-[var(--color-foreground)] truncate">UNIVERSITY OF KNOWLEDGE</span>
                </header>

                {/* Page content */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}

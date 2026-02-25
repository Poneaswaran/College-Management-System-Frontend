import { useEffect, useRef } from 'react';
import { CheckCheck, Loader2, WifiOff } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import NotificationEmptyState from './NotificationEmptyState';
import type { NotificationCategory } from '../../types/notification';

const CATEGORY_TABS: { key: string | null; label: string }[] = [
    { key: null, label: 'All' },
    { key: 'ATTENDANCE', label: 'Attendance' },
    { key: 'ASSIGNMENT', label: 'Assignments' },
    { key: 'GRADE', label: 'Grades' },
    { key: 'SYSTEM', label: 'System' },
];

const CATEGORY_TAB_COLORS: Record<string, string> = {
    ATTENDANCE: '#10b981',
    ASSIGNMENT: '#06b6d4',
    GRADE: '#8b5cf6',
    SYSTEM: '#fbbf24',
};

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const {
        notifications,
        unreadCount,
        loading,
        hasMore,
        connectionStatus,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        loadMore,
        activeCategory,
        setActiveCategory,
    } = useNotifications();

    const panelRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                // Don't close if click was on the bell button itself
                const bellEl = document.getElementById('notification-bell-btn');
                if (bellEl?.contains(e.target as Node)) return;
                onClose();
            }
        };
        // Delay to prevent the opening click from immediately closing
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    // Infinite scroll
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || !hasMore || loading) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
            loadMore();
        }
    };

    if (!isOpen) return null;

    const isDisconnected = connectionStatus === 'disconnected' || connectionStatus === 'error';

    return (
        <div
            ref={panelRef}
            className="absolute top-full right-0 mt-2 w-[380px] max-h-[520px] bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden z-[1060] flex flex-col animate-scale-in"
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
        >
            {/* ── Header ── */}
            <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[var(--color-foreground)]">
                            Notifications
                        </h2>
                        {unreadCount > 0 && (
                            <span className="text-[11px] font-bold text-white bg-[var(--color-secondary)] rounded-full px-2 py-0.5 leading-none">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isDisconnected && (
                            <span title="Reconnecting…">
                                <WifiOff size={14} className="text-[var(--color-foreground-muted)]" />
                            </span>
                        )}
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead(activeCategory ?? undefined)}
                                className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors flex items-center gap-1"
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Category tabs ── */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    {CATEGORY_TABS.map((tab) => {
                        const isActive = activeCategory === tab.key;
                        const accentColor = tab.key ? CATEGORY_TAB_COLORS[tab.key] : 'var(--color-primary)';
                        return (
                            <button
                                key={tab.key ?? 'all'}
                                onClick={() => setActiveCategory(tab.key as NotificationCategory | null)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200
                                    ${isActive
                                        ? 'text-white'
                                        : 'text-[var(--color-foreground-secondary)] hover:bg-[var(--color-background-secondary)]'
                                    }
                                `}
                                style={isActive ? { backgroundColor: accentColor } : undefined}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── List ── */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto divide-y divide-[var(--color-border)]/50"
                style={{ maxHeight: '380px' }}
            >
                {loading && notifications.length === 0 ? (
                    /* Skeleton loading */
                    <div className="space-y-0 divide-y divide-[var(--color-border)]/50">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-start gap-3 px-4 py-3">
                                <div className="w-8 h-8 rounded-lg skeleton-shimmer flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
                                    <div className="h-3 w-full rounded skeleton-shimmer" />
                                    <div className="h-2.5 w-1/3 rounded skeleton-shimmer" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <NotificationEmptyState />
                ) : (
                    <>
                        {notifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                onMarkAsRead={markAsRead}
                                onDismiss={dismissNotification}
                                onClosePanel={onClose}
                            />
                        ))}
                        {loading && (
                            <div className="flex justify-center py-3">
                                <Loader2 size={18} className="animate-spin text-[var(--color-foreground-muted)]" />
                            </div>
                        )}
                        {hasMore && !loading && (
                            <button
                                onClick={loadMore}
                                className="w-full py-2.5 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-background-secondary)] transition-colors"
                            >
                                Load more
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

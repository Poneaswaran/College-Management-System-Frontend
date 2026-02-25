import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
    const { unreadCount } = useNotifications();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isWiggling, setIsWiggling] = useState(false);
    const prevCountRef = useRef(unreadCount);

    // Wiggle animation when unread count increases (new notification)
    useEffect(() => {
        if (unreadCount > prevCountRef.current) {
            const id = setTimeout(() => {
                setIsWiggling(true);
                setTimeout(() => setIsWiggling(false), 800);
            }, 0);
            prevCountRef.current = unreadCount;
            return () => clearTimeout(id);
        }
        prevCountRef.current = unreadCount;
    }, [unreadCount]);

    const displayCount = unreadCount > 99 ? '99+' : unreadCount;

    return (
        <div className="relative">
            <button
                id="notification-bell-btn"
                onClick={() => setIsPanelOpen((prev) => !prev)}
                className={`
                    relative p-2 rounded-lg transition-all duration-200
                    hover:bg-[var(--color-background-secondary)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30
                    ${isWiggling ? 'notification-bell-wiggle' : ''}
                `}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
                <Bell
                    size={22}
                    className="text-[var(--color-foreground-secondary)] transition-colors"
                    style={isPanelOpen ? { color: 'var(--color-primary)' } : undefined}
                />

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="notification-badge absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[var(--color-error)] rounded-full leading-none border-2 border-[var(--color-card)]">
                        {displayCount}
                    </span>
                )}
            </button>

            <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
        </div>
    );
}
